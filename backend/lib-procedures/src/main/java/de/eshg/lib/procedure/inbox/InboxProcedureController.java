/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.inbox;

import static de.eshg.lib.procedure.mapping.InboxProcedureMapper.toInterfaceTypeWithResolvedFile;

import de.cronn.commons.lang.SetUtils;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.lib.procedure.api.InboxProcedureApi;
import de.eshg.lib.procedure.domain.model.InboxProcedure;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.mapping.InboxProcedureMapper;
import de.eshg.lib.procedure.model.ContactDetailsDto;
import de.eshg.lib.procedure.model.CreateInboxProcedureRequest;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.model.GetInboxProcedureResponse;
import de.eshg.lib.procedure.model.GetInboxProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresPaginationOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresResponse;
import de.eshg.lib.procedure.model.GetInboxProceduresSortOptions;
import de.eshg.lib.procedure.model.InboxProcedureDto;
import de.eshg.lib.procedure.model.InboxProcedureStatusDto;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Tag(name = "InboxProcedure")
public class InboxProcedureController implements InboxProcedureApi {

  private final InboxProcedureService inboxProcedureService;
  protected final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final UserHelper userHelper;

  public InboxProcedureController(
      InboxProcedureService inboxProcedureService,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      UserHelper userHelper) {
    this.inboxProcedureService = inboxProcedureService;
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
        inboxProcedureService.addInboxProcedure(createInboxProcedureRequest, file, fileMetaData);
    return InboxProcedureMapper.toInterfaceType(inboxProcedure);
  }

  @Override
  @Transactional(readOnly = true)
  public GetInboxProcedureResponse getInboxProcedure(UUID inboxProcedureId) {
    validateInboxEnabled();
    InboxProcedure resolvedInboxProcedure =
        inboxProcedureService.getInboxProcedureOrThrow(inboxProcedureId);
    InboxProcedureDto inboxProcedure = toInterfaceTypeWithResolvedFile(resolvedInboxProcedure);

    return new GetInboxProcedureResponse(
        inboxProcedure, userHelper.resolveUsers(SetUtils.orderedSet(inboxProcedure.createdBy())));
  }

  @Override
  @Transactional(readOnly = true)
  public GetInboxProceduresResponse getInboxProcedures(
      GetInboxProceduresFilterOptions filterOptions,
      GetInboxProceduresSortOptions sortOptions,
      GetInboxProceduresPaginationOptions paginationOptions) {
    validateInboxEnabled();
    Page<InboxProcedure> page =
        inboxProcedureService.getInboxProcedures(filterOptions, sortOptions, paginationOptions);

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
    InboxProcedure inboxProcedure =
        inboxProcedureService.updateInboxProcedureStatus(inboxProcedureId, inboxProcedureStatus);
    return InboxProcedureMapper.toInterfaceType(inboxProcedure);
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

  protected void validateInboxEnabled() {
    Set<BaseFeature> features = baseFeatureTogglesApi.getFeatureToggles().enabledNewFeatures();

    if (!features.contains(BaseFeature.INBOX)) {
      throw new IllegalStateException("New feature %s is not enabled".formatted(BaseFeature.INBOX));
    }
  }
}
