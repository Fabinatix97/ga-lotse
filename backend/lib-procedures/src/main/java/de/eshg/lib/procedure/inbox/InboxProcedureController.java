/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.inbox;

import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.mapping.InboxProcedureMapper.toInterfaceTypeWithResolvedFile;
import static de.eshg.lib.procedure.model.GetInboxProceduresSortOrderDto.*;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.procedure.api.InboxProcedureApi;
import de.eshg.lib.procedure.domain.model.InboxProcedure;
import de.eshg.lib.procedure.domain.model.InboxProcedureStatus;
import de.eshg.lib.procedure.domain.model.InboxProcedure_;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.repository.InboxProcedureRepository;
import de.eshg.lib.procedure.file.FileUploadService;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.mapping.InboxProcedureMapper;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.ContactDetailsDto;
import de.eshg.lib.procedure.model.CreateInboxProcedureRequest;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.model.GetInboxProcedureResponse;
import de.eshg.lib.procedure.model.GetInboxProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresPaginationOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresResponse;
import de.eshg.lib.procedure.model.GetInboxProceduresSortByDto;
import de.eshg.lib.procedure.model.GetInboxProceduresSortOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresSortOrderDto;
import de.eshg.lib.procedure.model.InboxProcedureDto;
import de.eshg.lib.procedure.model.InboxProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.time.Clock;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Tag(name = "InboxProcedure")
public class InboxProcedureController implements InboxProcedureApi {

  private final InboxProcedureRepository inboxProcedureRepository;
  private final FileUploadService fileUploadService;
  private final Clock clock;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final UserHelper userHelper;

  public InboxProcedureController(
      InboxProcedureRepository inboxProcedureRepository,
      FileUploadService fileUploadService,
      Clock clock,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      UserHelper userHelper) {
    this.inboxProcedureRepository = inboxProcedureRepository;
    this.fileUploadService = fileUploadService;
    this.clock = clock;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.userHelper = userHelper;
  }

  @Override
  @Transactional
  public InboxProcedureDto addInboxProcedure(
      CreateInboxProcedureRequest createInboxProcedureRequest,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {
    validateInboxEnabled();
    validateContactDetails(createInboxProcedureRequest.contactDetails());
    InboxProcedure inboxProcedure =
        InboxProcedureMapper.createInboxProcedure(createInboxProcedureRequest, clock);
    InboxProcedure persistedInboxProcedure = inboxProcedureRepository.save(inboxProcedure);

    if (Optional.ofNullable(file).isPresent()) {
      fileUploadService.handleFile(
          persistedInboxProcedure.getInboxProgressEntry(), file, fileMetaData);
    }

    inboxProcedureRepository.flush();
    return InboxProcedureMapper.toInterfaceType(inboxProcedure);
  }

  @Override
  @Transactional(readOnly = true)
  public GetInboxProcedureResponse getInboxProcedure(UUID inboxProcedureId) {
    validateInboxEnabled();
    InboxProcedure resolvedInboxProcedure = getInboxProcedureOrThrow(inboxProcedureId);
    InboxProcedureDto inboxProcedure = toInterfaceTypeWithResolvedFile(resolvedInboxProcedure);

    return new GetInboxProcedureResponse(
        inboxProcedure,
        userHelper.resolveUsers(new LinkedHashSet<>(List.of(inboxProcedure.createdBy()))));
  }

  @Override
  @Transactional(readOnly = true)
  public GetInboxProceduresResponse getInboxProcedures(
      GetInboxProceduresFilterOptions filterOptions,
      GetInboxProceduresSortOptions sortOptions,
      GetInboxProceduresPaginationOptions paginationOptions) {
    validateInboxEnabled();
    Page<InboxProcedure> page =
        inboxProcedureRepository.findAll(
            Specification.where(
                    inboxProcedureTypes(
                        filterOptions.inboxProcedureType(), filterOptions.includeUntyped()))
                .and(inboxProcedureStatus(filterOptions.inboxProcedureStatus())),
            PageRequest.of(
                paginationOptions.pageNumber(),
                paginationOptions.pageSize(),
                getSort(sortOptions.sortOrder(), sortOptions.sortBy())));

    List<InboxProcedureDto> inboxProcedures =
        page.stream().map(InboxProcedureMapper::toInterfaceType).toList();

    return new GetInboxProceduresResponse(
        page.getTotalPages(), page.getTotalElements(), inboxProcedures);
  }

  @Override
  @Transactional
  public InboxProcedureDto updateInboxProcedureStatus(
      UUID inboxProcedureId, InboxProcedureStatusDto inboxProcedureStatus) {
    validateInboxEnabled();
    InboxProcedure inboxProcedure = getInboxProcedureOrThrow(inboxProcedureId);
    inboxProcedure.updateInboxProcedureStatus(
        InboxProcedureMapper.toDomainType(inboxProcedureStatus), clock);
    inboxProcedureRepository.flush();
    return InboxProcedureMapper.toInterfaceType(inboxProcedure);
  }

  private InboxProcedure getInboxProcedureOrThrow(UUID inboxProcedureId) {
    return inboxProcedureRepository
        .findByExternalId(inboxProcedureId)
        .orElseThrow(() -> new NotFoundException("Inbox procedure not found"));
  }

  private Sort getSort(
      GetInboxProceduresSortOrderDto sortOrder, GetInboxProceduresSortByDto sortBy) {
    Sort.Direction direction = sortOrder == ASC ? Sort.Direction.ASC : Sort.Direction.DESC;
    String[] properties =
        switch (sortBy) {
          case CREATED_AT -> new String[] {InboxProcedure_.CREATED_AT, BaseEntity_.ID};
        };
    return Sort.by(direction, properties);
  }

  private Specification<InboxProcedure> inboxProcedureTypes(
      Set<ProcedureTypeDto> inboxProcedureTypes, Boolean includeUntyped) {

    if (CollectionUtils.isEmpty(inboxProcedureTypes)) {
      return null;
    }

    Set<ProcedureType> types = mapEnumSet(inboxProcedureTypes, ProcedureMapper::toDomainType);
    if (includeUntyped != null && includeUntyped) {
      return ((root, query, cb) ->
          cb.or(
              root.get(InboxProcedure_.procedureType).isNull(),
              root.get(InboxProcedure_.procedureType).in(types)));
    } else {
      return ((root, query, cb) -> root.get(InboxProcedure_.procedureType).in(types));
    }
  }

  private Specification<InboxProcedure> inboxProcedureStatus(
      Set<InboxProcedureStatusDto> inboxProcedureStatus) {

    if (CollectionUtils.isEmpty(inboxProcedureStatus)) {
      return null;
    }

    Set<InboxProcedureStatus> status =
        mapEnumSet(inboxProcedureStatus, InboxProcedureMapper::toDomainType);
    return ((root, query, cb) -> root.get(InboxProcedure_.inboxProcedureStatus).in(status));
  }

  private void validateContactDetails(ContactDetailsDto contactDetails) throws BadRequestException {
    if (StringUtils.isBlank(contactDetails.facilityName())
        && StringUtils.isBlank(contactDetails.lastName())) {
      throw new BadRequestException(
          "Facility name and last name are empty. At least one of them has to be submitted. Only whitespaces are forbidden.");
    } else if (StringUtils.isBlank(contactDetails.emailAddress())
        && StringUtils.isBlank(contactDetails.phoneNumber())
        && contactDetails.address() == null) {
      throw new BadRequestException(
          "Email address, phone number and address are not set. At least one of them has to be submitted. Only whitespaces are forbidden.");
    }
  }

  private void validateInboxEnabled() {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.INBOX)) {
      throw new IllegalStateException("New feature %s is not enabled".formatted(BaseFeature.INBOX));
    }
  }
}
