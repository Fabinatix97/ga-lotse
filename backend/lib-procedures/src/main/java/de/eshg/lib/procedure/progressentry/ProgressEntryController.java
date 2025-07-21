/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.progressentry;

import static de.eshg.domain.model.BaseEntity_.ID;
import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.MapperHelper.toEnumSet;
import static org.springframework.data.jpa.domain.Specification.allOf;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.foureyes.mapping.ApprovalRequestMapper;
import de.eshg.lib.foureyes.model.ApprovalRequestDto;
import de.eshg.lib.foureyes.model.CreateApprovalRequestRequest;
import de.eshg.lib.procedure.api.ProgressEntryApi;
import de.eshg.lib.procedure.domain.model.InboxProgressEntryType;
import de.eshg.lib.procedure.domain.model.KeyDocumentAware;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryType;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry_;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcessedInboxProgressEntry;
import de.eshg.lib.procedure.domain.model.ProcessedInboxProgressEntry_;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.ProgressEntry_;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry_;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.domain.repository.InboxProcedureRepository;
import de.eshg.lib.procedure.domain.repository.ProgressEntryRepository;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.mapping.ProgressEntryMapper;
import de.eshg.lib.procedure.model.CreateManualProgressEntryRequest;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.model.GetManualProgressEntryHistoryResponse;
import de.eshg.lib.procedure.model.GetProgressEntriesFilterOptions;
import de.eshg.lib.procedure.model.GetProgressEntriesResponse;
import de.eshg.lib.procedure.model.GetProgressEntriesSortOptions;
import de.eshg.lib.procedure.model.GetProgressEntryPaginationOptions;
import de.eshg.lib.procedure.model.GetProgressEntryResponse;
import de.eshg.lib.procedure.model.KeyDocumentAwareProgressEntryDto;
import de.eshg.lib.procedure.model.ManualProgressEntryDto;
import de.eshg.lib.procedure.model.PatchManualProgressEntryRequest;
import de.eshg.lib.procedure.model.ProgressEntryClassDto;
import de.eshg.lib.procedure.model.ProgressEntryDto;
import de.eshg.lib.procedure.model.ProgressEntrySortByDto;
import de.eshg.lib.procedure.model.ProgressEntrySortOrderDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.*;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Tag(name = "ProgressEntry")
public class ProgressEntryController<P extends Procedure<P, ?, ?, ?>> implements ProgressEntryApi {

  private final ProgressEntryRepository progressEntryRepository;
  private final ProgressEntryService<P> progressEntryService;
  private final InboxProcedureRepository inboxProcedureRepository;
  private final ApprovalRequestMapper approvalRequestMapper;
  private final UserHelper userHelper;

  public ProgressEntryController(
      ProgressEntryRepository progressEntryRepository,
      ProgressEntryService<P> progressEntryService,
      InboxProcedureRepository inboxProcedureRepository,
      ApprovalRequestMapper approvalRequestMapper,
      UserHelper userHelper) {
    this.progressEntryRepository = progressEntryRepository;
    this.progressEntryService = progressEntryService;
    this.inboxProcedureRepository = inboxProcedureRepository;
    this.approvalRequestMapper = approvalRequestMapper;
    this.userHelper = userHelper;
  }

  @Override
  @Transactional(readOnly = true)
  public GetProgressEntriesResponse getProgressEntries(
      UUID procedureId,
      GetProgressEntriesFilterOptions filterOptions,
      GetProgressEntriesSortOptions sortOptions,
      GetProgressEntryPaginationOptions paginationOptions) {
    P procedure = progressEntryService.getProcedureOrThrow(procedureId);

    List<Specification<ProgressEntry>> specifications = new ArrayList<>();
    specifications.add(progressEntryHasProcedureId(procedure.getId()));

    if (filterOptions.progressEntryClass() != null) {
      Set<Class<? extends ProgressEntry>> progressEntryEntityClasses =
          EnumSet.copyOf(filterOptions.progressEntryClass()).stream()
              .map(this::toProgressEntryEntityClass)
              .collect(StreamUtil.toLinkedHashSet());

      specifications.add(progressEntryHasClass(progressEntryEntityClasses));
    }

    if (filterOptions.progressEntryType() != null) {
      Set<ManualProgressEntryType> manualProgressEntryTypes =
          filterOptions.progressEntryType().stream()
              .map(ManualProgressEntryType::fromValueGracefully)
              .filter(Objects::nonNull)
              .collect(toEnumSet());

      Set<InboxProgressEntryType> inboxProgressEntryTypes =
          filterOptions.progressEntryType().stream()
              .map(InboxProgressEntryType::fromValueGracefully)
              .filter(Objects::nonNull)
              .collect(toEnumSet());

      Set<String> progressEntryTypesAsString =
          filterOptions.progressEntryType().stream().sorted().collect(StreamUtil.toLinkedHashSet());

      specifications.add(
          progressEntryHasType(
              manualProgressEntryTypes, inboxProgressEntryTypes, progressEntryTypesAsString));
    }

    if (filterOptions.initiatedBy() != null) {
      specifications.add(progressEntryWasInitiatedBy(filterOptions.initiatedBy()));
    }

    if (filterOptions.triggerType() != null) {
      Set<TriggerType> triggerTypes =
          mapEnumSet(filterOptions.triggerType(), ProgressEntryMapper::toDomainType);
      specifications.add(progressEntryHasTriggerType(triggerTypes));
    }

    Sort sort = mapToSort(sortOptions);
    Page<ProgressEntry> page =
        progressEntryRepository.findAll(
            allOf(specifications),
            PageRequest.ofSize(paginationOptions.pageSize())
                .withPage(paginationOptions.pageNumber())
                .withSort(sort));

    List<ProgressEntryDto> progressEntries =
        progressEntryRepository.fetchFilesMetaDataAndInboxProcedure(page.toList(), sort).stream()
            .map(ProgressEntryMapper::toInterfaceType)
            .toList();

    return new GetProgressEntriesResponse(
        page.getTotalPages(),
        page.getTotalElements(),
        progressEntries,
        userHelper.resolveUsers(progressEntries));
  }

  @Override
  @Transactional
  public ManualProgressEntryDto addProgressEntry(
      UUID procedureId,
      CreateManualProgressEntryRequest createManualProgressEntryRequest,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {
    ManualProgressEntry manualProgressEntry =
        ProgressEntryMapper.toDomainType(createManualProgressEntryRequest);

    ManualProgressEntry savedManualProgressEntry =
        progressEntryService.addManualProgressEntry(
            procedureId, manualProgressEntry, file, fileMetaData);

    return ProgressEntryMapper.toInterfaceType(savedManualProgressEntry);
  }

  private Sort mapToSort(GetProgressEntriesSortOptions sortOptions) {
    Direction direction = mapToSortOrder(sortOptions.sortOrder());
    return Sort.by(
        Order.by(mapToDomainProperty(sortOptions.sortBy())).with(direction),
        Order.by(ID).with(direction));
  }

  private Direction mapToSortOrder(ProgressEntrySortOrderDto progressEntrySortOrder) {
    return switch (progressEntrySortOrder) {
      case ASC -> Direction.ASC;
      case DESC -> Direction.DESC;
    };
  }

  private String mapToDomainProperty(ProgressEntrySortByDto progressEntrySortBy) {
    return switch (progressEntrySortBy) {
      case CREATED_AT -> ProgressEntry_.CREATED_AT;
      case MODIFIED_AT -> ProgressEntry_.MODIFIED_AT;
    };
  }

  private Specification<ProgressEntry> progressEntryHasTriggerType(Set<TriggerType> triggerTypes) {
    return (root, query, cb) ->
        cb.treat(root, SystemProgressEntry.class)
            .get(SystemProgressEntry_.triggerType)
            .in(triggerTypes);
  }

  private Specification<ProgressEntry> progressEntryWasInitiatedBy(Set<UUID> userIds) {
    return (root, query, cb) ->
        cb.or(
            cb.treat(root, ManualProgressEntry.class)
                .get(ManualProgressEntry_.createdBy)
                .in(userIds),
            cb.treat(root, ProcessedInboxProgressEntry.class)
                .get(ProcessedInboxProgressEntry_.createdBy)
                .in(userIds),
            cb.treat(root, SystemProgressEntry.class)
                .get(SystemProgressEntry_.triggeredBy)
                .in(userIds));
  }

  private Specification<ProgressEntry> progressEntryHasType(
      Set<ManualProgressEntryType> manualProgressEntryTypes,
      Set<InboxProgressEntryType> inboxProgressEntryTypes,
      Set<String> progressEntryTypesAsString) {
    return (root, query, cb) ->
        cb.or(
            cb.treat(root, ManualProgressEntry.class)
                .get(ManualProgressEntry_.manualProgressEntryType)
                .in(manualProgressEntryTypes),
            cb.treat(root, ProcessedInboxProgressEntry.class)
                .get(ProcessedInboxProgressEntry_.inboxProgressEntryType)
                .in(inboxProgressEntryTypes),
            cb.treat(root, SystemProgressEntry.class)
                .get(SystemProgressEntry_.systemProgressEntryType)
                .in(progressEntryTypesAsString));
  }

  private Class<? extends ProgressEntry> toProgressEntryEntityClass(
      ProgressEntryClassDto progressEntryClassDto) {
    return switch (progressEntryClassDto) {
      case MANUAL_PROGRESS_ENTRY -> ManualProgressEntry.class;
      case SYSTEM_PROGRESS_ENTRY -> SystemProgressEntry.class;
      case PROCESSED_INBOX_PROGRESS_ENTRY -> ProcessedInboxProgressEntry.class;
    };
  }

  private Specification<ProgressEntry> progressEntryHasClass(
      Set<Class<? extends ProgressEntry>> progressEntryClasses) {
    return (root, query, cb) -> root.type().in(progressEntryClasses);
  }

  private Specification<ProgressEntry> progressEntryHasProcedureId(Long internalProcedureId) {
    return (root, query, cb) -> cb.equal(root.get(ProgressEntry_.procedureId), internalProcedureId);
  }

  @Override
  @Transactional
  public void removeProgressEntry(UUID procedureId, UUID progressEntryId) {
    progressEntryService.removeProgressEntry(procedureId, progressEntryId);
  }

  @Override
  @Transactional(readOnly = true)
  public GetProgressEntryResponse getProgressEntry(UUID procedureId, UUID progressEntryId) {
    ProgressEntry progressEntry =
        progressEntryService.getProgressEntryOrThrow(procedureId, progressEntryId);
    List<KeyDocumentAwareProgressEntryDto> relatedKeyDocumentProgressEntries =
        getRelatedKeyDocumentProgressEntries(progressEntry);

    ProgressEntryDto progressEntryDto = ProgressEntryMapper.toInterfaceType(progressEntry);
    return new GetProgressEntryResponse(
        progressEntryDto,
        relatedKeyDocumentProgressEntries,
        userHelper.resolveUsers(
            Stream.concat(Stream.of(progressEntryDto), relatedKeyDocumentProgressEntries.stream())
                .toList()));
  }

  private List<KeyDocumentAwareProgressEntryDto> getRelatedKeyDocumentProgressEntries(
      ProgressEntry progressEntry) {
    if (!(progressEntry instanceof KeyDocumentAware keyDocumentAware)) {
      return Collections.emptyList();
    }

    if (keyDocumentAware.getKeyDocumentType() == null) {
      return Collections.emptyList();
    }

    return progressEntryRepository
        .findAllByProcedureIdAndKeyDocumentTypeAndNotIdFetchingFile(
            progressEntry.getProcedureId(),
            keyDocumentAware.getKeyDocumentType(),
            progressEntry.getId())
        .stream()
        .map(ProgressEntryMapper::toInterfaceType)
        .filter(KeyDocumentAwareProgressEntryDto.class::isInstance)
        .map(KeyDocumentAwareProgressEntryDto.class::cast)
        .toList();
  }

  @Override
  @Transactional
  public ApprovalRequestDto requestProgressEntryDeletion(
      UUID procedureId,
      UUID progressEntryId,
      CreateApprovalRequestRequest createApprovalRequestRequest) {
    ManualProgressEntryDeletionApprovalRequest manualProgressEntryDeletionApprovalRequest =
        progressEntryService.requestProgressEntryDeletion(
            procedureId, progressEntryId, createApprovalRequestRequest.reason());
    return approvalRequestMapper.toInterfaceType(manualProgressEntryDeletionApprovalRequest);
  }

  @Override
  @Transactional
  public ManualProgressEntryDto patchProgressEntry(
      UUID procedureId,
      UUID progressEntryId,
      PatchManualProgressEntryRequest patchManualProgressEntryRequest) {
    ManualProgressEntry manualProgressEntry =
        progressEntryService.patchProgressEntry(
            procedureId, progressEntryId, patchManualProgressEntryRequest);

    return ProgressEntryMapper.toInterfaceType(manualProgressEntry);
  }

  @Override
  @Transactional(readOnly = true)
  public GetManualProgressEntryHistoryResponse getManualProgressEntryHistory(
      UUID procedureId, UUID progressEntryId) {
    return progressEntryService.getManualProgressEntryHistory(procedureId, progressEntryId);
  }
}
