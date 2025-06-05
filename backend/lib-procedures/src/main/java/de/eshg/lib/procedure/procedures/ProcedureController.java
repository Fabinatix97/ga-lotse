/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.domain.model.Assignment_.assigneeId;
import static de.eshg.lib.procedure.domain.model.Procedure_.CREATED_AT;
import static de.eshg.lib.procedure.domain.model.Procedure_.ID;
import static de.eshg.lib.procedure.domain.model.Procedure_.MODIFIED_AT;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureStatus;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureType;
import static de.eshg.lib.procedure.domain.model.Procedure_.tasks;
import static de.eshg.lib.procedure.domain.model.ProgressEntry_.procedureId;
import static de.eshg.lib.procedure.domain.model.Task_.currentAssignment;
import static de.eshg.lib.procedure.domain.model.Task_.procedure;
import static java.util.function.Predicate.not;
import static java.util.stream.Collectors.toMap;
import static org.springframework.data.domain.PageRequest.ofSize;
import static org.springframework.data.jpa.domain.Specification.allOf;
import static org.springframework.data.jpa.domain.Specification.where;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import de.eshg.lib.foureyes.domain.repository.GenericApprovalRequestRepository;
import de.eshg.lib.foureyes.mapping.ApprovalRequestMapper;
import de.eshg.lib.foureyes.model.ApprovalRequestDto;
import de.eshg.lib.procedure.api.ProcedureApi;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.File_;
import de.eshg.lib.procedure.domain.model.KeyDocumentAware;
import de.eshg.lib.procedure.domain.model.Mail;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry_;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.ProgressEntry_;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository.StatusAndCount;
import de.eshg.lib.procedure.domain.repository.ProgressEntryRepository;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.helper.UserHelper.UserFirstAndLastName;
import de.eshg.lib.procedure.mapping.FacilityTypeMapper;
import de.eshg.lib.procedure.mapping.FileMapper;
import de.eshg.lib.procedure.mapping.PersonTypeMapper;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.CheckFileStateUsageRequest;
import de.eshg.lib.procedure.model.CheckFileStateUsageResponse;
import de.eshg.lib.procedure.model.DetailedFacilityDto;
import de.eshg.lib.procedure.model.DetailedPersonDto;
import de.eshg.lib.procedure.model.DetailedTaskDto;
import de.eshg.lib.procedure.model.FacilityTypeDto;
import de.eshg.lib.procedure.model.GetDetailedProcedureResponse;
import de.eshg.lib.procedure.model.GetProcedureApprovalRequestsResponse;
import de.eshg.lib.procedure.model.GetProcedureFileDetailsResponse;
import de.eshg.lib.procedure.model.GetProcedureMetricsResponse;
import de.eshg.lib.procedure.model.GetProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetProceduresPaginationOptions;
import de.eshg.lib.procedure.model.GetProceduresResponse;
import de.eshg.lib.procedure.model.GetProceduresSortByDto;
import de.eshg.lib.procedure.model.GetProceduresSortOptionsDto;
import de.eshg.lib.procedure.model.GetProceduresSortOrderDto;
import de.eshg.lib.procedure.model.GetRecentProceduresResponse;
import de.eshg.lib.procedure.model.PersonTypeDto;
import de.eshg.lib.procedure.model.ProcedureDto;
import de.eshg.lib.procedure.model.ProcedureMetric;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.lib.procedure.util.MetricTimeRangeValidator;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnBean(ProcedureRepository.class)
@Tag(name = "Procedure")
public class ProcedureController<
        ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>, TaskT extends Task<ProcedureT>>
    implements ProcedureApi {
  private static final Logger log = LoggerFactory.getLogger(ProcedureController.class);

  private final BusinessModule businessModule;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final GenericApprovalRequestRepository approvalRequestRepository;
  private final ProgressEntryRepository progressEntryRepository;
  private final ApprovalRequestMapper approvalRequestMapper;
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final FacilityApi facilityApi;
  private final PersonApi personApi;
  private final UserHelper userHelper;
  private final ProcedureSearchService<ProcedureT> procedureSearchService;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;

  public ProcedureController(
      BusinessModule businessModule,
      ProcedureRepository<ProcedureT> procedureRepository,
      GenericApprovalRequestRepository approvalRequestRepository,
      ProgressEntryRepository progressEntryRepository,
      ApprovalRequestMapper approvalRequestMapper,
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      FacilityApi facilityApi,
      PersonApi personApi,
      UserHelper userHelper,
      ProcedureSearchService<ProcedureT> procedureSearchService,
      BaseFeatureTogglesApi baseFeatureTogglesApi) {
    this.businessModule = businessModule;
    this.procedureRepository = procedureRepository;
    this.approvalRequestRepository = approvalRequestRepository;
    this.approvalRequestMapper = approvalRequestMapper;
    this.enrichingMapper = enrichingMapper;
    this.facilityApi = facilityApi;
    this.personApi = personApi;
    this.userHelper = userHelper;
    this.progressEntryRepository = progressEntryRepository;
    this.procedureSearchService = procedureSearchService;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
  }

  @Override
  @Transactional(readOnly = true)
  public GetRecentProceduresResponse getSelfRecentProcedures(
      Set<ProcedureTypeDto> procedureTypes,
      Set<ProcedureStatusDto> procedureStatus,
      Integer limit) {
    UUID userId = CurrentUserHelper.getCurrentUserId();

    Set<ProcedureStatus> status = mapEnumSet(procedureStatus, ProcedureMapper::toDomainType);
    Set<ProcedureType> types = mapEnumSet(procedureTypes, ProcedureMapper::toDomainType);

    List<ProcedureT> recentProcedures =
        procedureRepository
            .findAll(
                where(anyTaskIsAssignedToUser(userId)).and(statusIsIn(status)).and(typeIsIn(types)),
                ofSize(limit).withSort(Direction.DESC, MODIFIED_AT, ID))
            .stream()
            .toList();

    List<ProcedureDto> enrichedProcedures =
        enrichingMapper.enrichAndMapProcedures(recentProcedures);
    return new GetRecentProceduresResponse(enrichedProcedures);
  }

  @Override
  @Transactional(readOnly = true)
  public GetProceduresResponse getProcedures(
      GetProceduresFilterOptions filterOptions,
      GetProceduresSortOptionsDto sortOptions,
      GetProceduresPaginationOptions paginationOptions) {

    List<Specification<ProcedureT>> specifications = new ArrayList<>();

    if (filterOptions.assignedToId() != null) {
      specifications.add(anyTaskIsAssignedToUser(filterOptions.assignedToId()));
    }

    if (filterOptions.procedureType() != null) {
      Set<ProcedureType> domainProcedureTypes =
          mapEnumSet(filterOptions.procedureType(), ProcedureMapper::toDomainType);

      specifications.add(typeIsIn(domainProcedureTypes));
    }

    if (filterOptions.procedureStatus() != null) {
      Set<ProcedureStatus> domainProcedureStatus =
          mapEnumSet(filterOptions.procedureStatus(), ProcedureMapper::toDomainType);

      specifications.add(statusIsIn(domainProcedureStatus));
    }

    Page<ProcedureT> page =
        procedureRepository.findAll(
            where(allOf(specifications)),
            ofSize(paginationOptions.pageSize())
                .withPage(paginationOptions.pageNumber())
                .withSort(mapToSort(sortOptions)));

    List<ProcedureDto> enrichedProcedures =
        enrichingMapper.enrichAndMapProcedures(page.stream().toList());

    return new GetProceduresResponse(
        page.getTotalPages(), page.getTotalElements(), enrichedProcedures);
  }

  @Override
  @Transactional(readOnly = true)
  public GetProceduresResponse searchProcedures(String query) {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.SEARCH_PROCEDURES)) {
      throw new IllegalStateException(
          "New feature %s is not enabled".formatted(BaseFeature.SEARCH_PROCEDURES));
    }

    List<ProcedureDto> enrichedProcedures =
        enrichingMapper.enrichAndMapProcedures(
            procedureSearchService.searchProcedures(query).procedures());
    return new GetProceduresResponse(1, enrichedProcedures.size(), enrichedProcedures);
  }

  @Override
  @Transactional(readOnly = true)
  public GetProcedureApprovalRequestsResponse getApprovalRequests(UUID procedureId) {
    ProcedureT procedure = resolveProcedureByExternalIdOrThrow(procedureId);
    List<ApprovalRequest<?>> approvalRequests =
        approvalRequestRepository.findAllByStatusIsOpenAndUserIsNotCurrent(
            where(isAttachedToProcedure(procedure)));

    List<ApprovalRequestDto> approvalRequestDtos =
        approvalRequests.stream().map(approvalRequestMapper::toInterfaceType).toList();
    Map<UUID, UserDto> resolvedUsers = userHelper.resolveUsers(approvalRequestDtos);

    return new GetProcedureApprovalRequestsResponse(approvalRequestDtos, resolvedUsers);
  }

  @Override
  public CheckFileStateUsageResponse checkFileStateUsage(CheckFileStateUsageRequest request) {
    log.info("Checking usage of file state ids: {}", request.fileStatesIds());
    List<UUID> centralFileStateIdsInUse =
        procedureRepository.findCentralFileStateIdsInUseNoDuplicates(request.fileStatesIds());
    return new CheckFileStateUsageResponse(centralFileStateIdsInUse);
  }

  private Specification<ApprovalRequest<?>> isAttachedToProcedure(ProcedureT procedure) {
    return (root, query, cb) ->
        cb.or(
            isManualProgressEntryAttachedToProcedure(procedure, root, query, cb),
            isFileDeletionApprovalRequestAttachedToProcedure(procedure, root, query, cb));
  }

  private Predicate isFileDeletionApprovalRequestAttachedToProcedure(
      ProcedureT procedure,
      Root<ApprovalRequest<?>> root,
      CriteriaQuery<?> query,
      CriteriaBuilder cb) {

    Root<FileDeletionApprovalRequest> fileDeletionApprovalRequestRoot =
        cb.treat(root, FileDeletionApprovalRequest.class);

    Root<ProgressEntry> progressEntryRoot = query.from(ProgressEntry.class);
    Join<ProgressEntry, File> progressEntryFile =
        progressEntryRoot.join(ProgressEntry_.file, JoinType.LEFT);

    Join<File, ApprovalRequest<?>> fileApprovalRequest =
        progressEntryFile.join(File_.DELETION_APPROVAL_REQUEST, JoinType.LEFT);

    return cb.and(
        cb.equal(fileApprovalRequest, fileDeletionApprovalRequestRoot),
        cb.equal(progressEntryRoot.get(procedureId), procedure.getId()));
  }

  private Predicate isManualProgressEntryAttachedToProcedure(
      ProcedureT procedure,
      Root<ApprovalRequest<?>> root,
      CriteriaQuery<?> query,
      CriteriaBuilder cb) {

    Root<ManualProgressEntryDeletionApprovalRequest>
        manualProgressEntryDeletionApprovalRequestRoot =
            cb.treat(root, ManualProgressEntryDeletionApprovalRequest.class);

    Root<ManualProgressEntry> manualProgressEntryRoot = query.from(ManualProgressEntry.class);
    Join<ManualProgressEntry, ManualProgressEntryDeletionApprovalRequest>
        manualProgressEntryDeletionRequest =
            manualProgressEntryRoot.join(
                ManualProgressEntry_.DELETION_APPROVAL_REQUEST, JoinType.LEFT);

    return cb.and(
        cb.equal(
            manualProgressEntryDeletionRequest, manualProgressEntryDeletionApprovalRequestRoot),
        cb.equal(manualProgressEntryRoot.get(procedureId), procedure.getId()));
  }

  private Sort mapToSort(GetProceduresSortOptionsDto sortOptions) {
    return Sort.by(
        Order.by(mapToDomainProperty(sortOptions.sortBy()))
            .with(mapToSortOrder(sortOptions.sortOrder())),
        Order.by(ID));
  }

  private Direction mapToSortOrder(GetProceduresSortOrderDto sortOrder) {
    return switch (sortOrder) {
      case ASC -> Direction.ASC;
      case DESC -> Direction.DESC;
    };
  }

  private String mapToDomainProperty(GetProceduresSortByDto sortBy) {
    return switch (sortBy) {
      case CREATED_AT -> CREATED_AT;
      case MODIFIED_AT -> MODIFIED_AT;
    };
  }

  private Subquery<?> queryTasksThatAreAttachedToProcedureAndAssignedToUser(
      Root<ProcedureT> procedureRoot, CriteriaQuery<?> query, CriteriaBuilder cb, UUID userId) {
    Subquery<? extends Task<?>> subquery = query.subquery(tasks.getBindableJavaType());
    Root<? extends Task<?>> taskRoot = subquery.from(tasks.getBindableJavaType());

    return subquery.where(
        taskIsAttachedToProcedure(cb, taskRoot, procedureRoot),
        taskIsAssignedToUser(cb, taskRoot, userId));
  }

  private Predicate taskIsAssignedToUser(
      CriteriaBuilder cb, Path<? extends Task<?>> taskRoot, UUID userId) {
    return cb.equal(taskRoot.get(currentAssignment).get(assigneeId), userId);
  }

  private Predicate taskIsAttachedToProcedure(
      CriteriaBuilder cb, Root<? extends Task<?>> taskRoot, Root<ProcedureT> procedureRoot) {
    return cb.equal(taskRoot.get(procedure), procedureRoot);
  }

  private Specification<ProcedureT> anyTaskIsAssignedToUser(UUID userId) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.exists(
            queryTasksThatAreAttachedToProcedureAndAssignedToUser(
                root, query, criteriaBuilder, userId));
  }

  private Specification<ProcedureT> statusIsIn(Set<ProcedureStatus> statuses) {
    if (statuses == null) {
      return null;
    }
    return (root, query, criteriaBuilder) -> root.get(procedureStatus).in(statuses);
  }

  private Specification<ProcedureT> typeIsIn(Set<ProcedureType> types) {
    if (types == null) {
      return null;
    }

    return (root, query, criteriaBuilder) -> root.get(procedureType).in(types);
  }

  @Override
  @Transactional(readOnly = true)
  public GetProcedureMetricsResponse getProcedureMetrics(
      Instant timeRangeStart, Instant timeRangeEnd) {
    MetricTimeRangeValidator.validateTimeRange(timeRangeStart, timeRangeEnd);

    return new GetProcedureMetricsResponse(
        getAggregatedProcedureMetrics(timeRangeStart, timeRangeEnd));
  }

  private List<ProcedureMetric> getAggregatedProcedureMetrics(
      Instant timeRangeStart, Instant timeRangeEnd) {
    Set<ProcedureType> procedureTypes = procedureRepository.findDistinctProcedureTypes();
    List<ProcedureMetric> procedureMetrics = new ArrayList<>(procedureTypes.size());

    procedureTypes.forEach(
        procedureType -> {
          Map<ProcedureStatus, Long> statusCountsPerType =
              getStatusCounts(procedureType, timeRangeStart, timeRangeEnd);
          procedureMetrics.add(
              new ProcedureMetric(
                  businessModule,
                  ProcedureMapper.toInterfaceType(procedureType),
                  statusCountsPerType.values().stream().mapToLong(Long::longValue).sum(),
                  Stream.of(ProcedureStatus.OPEN, ProcedureStatus.DRAFT)
                      .mapToLong(status -> statusCountsPerType.getOrDefault(status, 0L))
                      .sum(),
                  statusCountsPerType.getOrDefault(ProcedureStatus.IN_PROGRESS, 0L),
                  statusCountsPerType.getOrDefault(ProcedureStatus.ABORTED, 0L),
                  statusCountsPerType.getOrDefault(ProcedureStatus.CLOSED, 0L),
                  getAverageDuration(procedureType, timeRangeStart, timeRangeEnd)));
        });
    return procedureMetrics.stream()
        .sorted(Comparator.comparing(procedureMetric -> procedureMetric.procedureType().name()))
        .toList();
  }

  private Map<ProcedureStatus, Long> getStatusCounts(
      ProcedureType type, Instant timeRangeStart, Instant timeRangeEnd) {

    return procedureRepository
        .findStatusCountsForTypeWithinTimeRange(type, timeRangeStart, timeRangeEnd)
        .collect(StreamUtil.toLinkedHashMap(StatusAndCount::getStatus, StatusAndCount::getCount));
  }

  private String getAverageDuration(
      ProcedureType procedureType, Instant timeRangeStart, Instant timeRangeEnd) {
    List<Duration> durations =
        procedureRepository.findProcedureDurations(
            procedureType, ProcedureStatus.CLOSED, timeRangeStart, timeRangeEnd);

    if (durations.isEmpty()) {
      return null;
    }

    Duration duration =
        Duration.ofMinutes(
            Math.round(durations.stream().mapToLong(Duration::toMinutes).average().orElseThrow()));
    if (isValidDuration(duration)) {
      return duration.toString();
    } else {
      log.warn(
          "Negative duration for metrics of '{}' from '{}' to '{}'",
          procedureType,
          timeRangeStart,
          timeRangeEnd);
      return null;
    }
  }

  /*
   * Duration.isNegative only checks the seconds, not the nanos
   */
  private static boolean isValidDuration(Duration duration) {
    return duration.isZero() || duration.isPositive();
  }

  @Override
  @Transactional(readOnly = true)
  public GetDetailedProcedureResponse getDetailedProcedure(UUID id) {
    ProcedureT domainProcedure = resolveProcedureByExternalIdOrThrow(id);

    ProcedureDto procedure =
        enrichingMapper.enrichAndMapProcedures(List.of(domainProcedure)).getFirst();

    List<DetailedPersonDto> persons = createDetailedPersonDtos(domainProcedure.getRelatedPersons());

    List<DetailedFacilityDto> facilities =
        createDetailedFacilityDtos(domainProcedure.getRelatedFacilities());

    List<DetailedTaskDto> tasks = createDetailedTaskDtos(domainProcedure.getTasks());

    return new GetDetailedProcedureResponse(procedure, persons, facilities, tasks);
  }

  private List<DetailedTaskDto> createDetailedTaskDtos(List<TaskT> tasks) {
    if (tasks.isEmpty()) {
      return Collections.emptyList();
    }

    Set<UUID> userUuids = collectUserUuidsFromTasks(tasks);

    Map<UUID, UserFirstAndLastName> firstNameAndLastNameByUserId =
        userHelper.resolveUsersFirstNamesAndLastNamesByUserUuids(userUuids);

    return tasks.stream()
        .map(task -> toDetailedTaskDto(task, firstNameAndLastNameByUserId))
        .toList();
  }

  private DetailedTaskDto toDetailedTaskDto(
      TaskT task, Map<UUID, UserFirstAndLastName> firstNameAndLastNameByUserId) {
    return new DetailedTaskDto(
        enrichingMapper.enrichAndMapTasks(List.of(task)).getFirst(),
        getFullNameIfPresent(firstNameAndLastNameByUserId, task.getAssigneeId()),
        getFullNameIfPresent(firstNameAndLastNameByUserId, task.getAssignedById()));
  }

  private String getFullNameIfPresent(
      Map<UUID, UserFirstAndLastName> firstNameAndLastNameByUserId, UUID key) {
    if (key == null) {
      return null;
    }

    if (firstNameAndLastNameByUserId.containsKey(key)) {
      return firstNameAndLastNameByUserId.get(key).asFullName();
    }

    return null;
  }

  private Set<UUID> collectUserUuidsFromTasks(List<TaskT> tasks) {
    Stream<UUID> assigneeIds = tasks.stream().map(TaskT::getAssigneeId);
    Stream<UUID> assignedByIds = tasks.stream().map(TaskT::getAssignedById);

    return Stream.concat(assigneeIds, assignedByIds)
        .filter(Objects::nonNull)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private List<DetailedPersonDto> createDetailedPersonDtos(
      List<? extends RelatedPerson<ProcedureT>> relatedPersons) {
    if (relatedPersons.isEmpty()) {
      return Collections.emptyList();
    }

    GetPersonFileStatesResponse personFileStatesResponse = getPersonFileStates(relatedPersons);

    Map<UUID, PersonType> personTypeByCentralFileStateId =
        relatedPersons.stream()
            .collect(toMap(RelatedPerson::getCentralFileStateId, RelatedPerson::getPersonType));

    List<DetailedPersonDto> result = new ArrayList<>();

    for (GetPersonFileStateResponse personDto : personFileStatesResponse.personFileStates()) {
      PersonType personType = personTypeByCentralFileStateId.get(personDto.id());
      PersonTypeDto personTypeDto = PersonTypeMapper.toInterfaceType(personType);
      result.add(new DetailedPersonDto(personDto, personTypeDto));
    }

    return result;
  }

  private GetPersonFileStatesResponse getPersonFileStates(
      List<? extends RelatedPerson<ProcedureT>> relatedPersons) {

    List<UUID> centralFileStateIds =
        relatedPersons.stream().map(RelatedPerson::getCentralFileStateId).toList();

    return personApi.getPersonFileStates(new GetPersonFileStatesRequest(centralFileStateIds));
  }

  private List<DetailedFacilityDto> createDetailedFacilityDtos(
      List<? extends RelatedFacility<ProcedureT>> relatedFacilities) {
    if (relatedFacilities.isEmpty()) {
      return Collections.emptyList();
    }

    List<UUID> centralFileStateIds =
        relatedFacilities.stream().map(RelatedFacility::getCentralFileStateId).toList();

    GetFacilityFileStatesResponse facilityFileStatesResponse =
        facilityApi.getFacilityFileStates(new GetFacilityFileStatesRequest(centralFileStateIds));

    Map<UUID, FacilityType> facilityTypeByCentralFileStateId =
        relatedFacilities.stream()
            .collect(
                toMap(RelatedFacility::getCentralFileStateId, RelatedFacility::getFacilityType));

    List<DetailedFacilityDto> result = new ArrayList<>();

    for (GetFacilityFileStateResponse getFacilityFileStateResponse :
        facilityFileStatesResponse.facilityFileStates()) {
      FacilityType facilityType =
          facilityTypeByCentralFileStateId.get(getFacilityFileStateResponse.id());
      FacilityTypeDto facilityTypeDto = FacilityTypeMapper.toInterfaceType(facilityType);
      result.add(new DetailedFacilityDto(getFacilityFileStateResponse, facilityTypeDto));
    }

    return result;
  }

  private ProcedureT resolveProcedureByExternalIdOrThrow(UUID id) {
    return procedureRepository
        .findByExternalId(id)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  @Override
  @Transactional(readOnly = true)
  public GetProcedureFileDetailsResponse getProcedureFileDetails(UUID id) {
    ProcedureT procedureT = resolveProcedureByExternalIdOrThrow(id);

    List<ProgressEntry> procedureProgressEntries =
        progressEntryRepository.findAllByProcedureIdAndFetchFile(procedureT.getId()).stream()
            .filter(progressEntry -> progressEntry.getFile() != null)
            .filter(p -> !p.getFile().isDeleted())
            .toList();

    return new GetProcedureFileDetailsResponse(
        id,
        Stream.concat(
                collectMaximumKeyDocumentVersionProgressEntries(procedureProgressEntries),
                collectProgressEntriesWithoutKeyDocumentType(procedureProgressEntries))
            .mapMulti(this::collectFilesAndAttachments)
            .sorted(
                Comparator.comparing(
                        ProgressEntryReferenceFilePair::file,
                        Comparator.comparing(File::getCreatedAt).thenComparing(BaseEntity::getId))
                    .reversed())
            .map(FileMapper::toInterfaceType)
            .toList());
  }

  private static Stream<ProgressEntry> collectProgressEntriesWithoutKeyDocumentType(
      List<ProgressEntry> progressEntries) {
    return progressEntries.stream().filter(not(ProcedureController::hasKeyDocumentType));
  }

  private static Stream<ProgressEntry> collectMaximumKeyDocumentVersionProgressEntries(
      List<ProgressEntry> progressEntries) {
    Map<String, Optional<KeyDocumentAware>>
        maximumKeyDocumentVersionProgressEntriesPerKeyDocumentType =
            progressEntries.stream()
                .filter(ProcedureController::hasKeyDocumentType)
                .map(KeyDocumentAware.class::cast)
                .collect(
                    Collectors.groupingBy(
                        KeyDocumentAware::getKeyDocumentType,
                        Collectors.maxBy(
                            Comparator.comparing(KeyDocumentAware::getKeyDocumentVersion))));

    return maximumKeyDocumentVersionProgressEntriesPerKeyDocumentType.values().stream()
        .flatMap(Optional::stream)
        .map(ProcedureController::toProgressEntry);
  }

  private static boolean hasKeyDocumentType(ProgressEntry progressentry) {
    return progressentry instanceof KeyDocumentAware keyDocumentAware
        && keyDocumentAware.getKeyDocumentType() != null;
  }

  private static ProgressEntry toProgressEntry(KeyDocumentAware keyDocumentAware) {
    return switch (keyDocumentAware) {
      case ManualProgressEntry manualProgressEntry -> manualProgressEntry;
      case SystemProgressEntry systemProgressEntry -> systemProgressEntry;
    };
  }

  private void collectFilesAndAttachments(
      ProgressEntry progressEntry, Consumer<ProgressEntryReferenceFilePair> filePairCollector) {
    UUID externalId = progressEntry.getExternalId();
    File file = progressEntry.getFile();

    filePairCollector.accept(new ProgressEntryReferenceFilePair(externalId, file));

    if (file instanceof Mail mail) {
      mail.getAttachments().stream()
          .map(attachment -> new ProgressEntryReferenceFilePair(externalId, attachment))
          .forEach(filePairCollector);
    }
  }
}
