/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import static java.util.stream.Collectors.toUnmodifiableMap;
import static org.springframework.util.CollectionUtils.isEmpty;

import com.google.common.collect.Streams;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.*;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStateResponse;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.domain.model.SequencedBaseEntity_;
import de.eshg.inspection.facility.api.GetPendingFacilitiesFilterOptionsDto;
import de.eshg.inspection.facility.api.GetPendingFacilitiesPaginationOptionsDto;
import de.eshg.inspection.facility.api.InspAddFacilityRequest;
import de.eshg.inspection.facility.api.InspAddFacilityResponse;
import de.eshg.inspection.facility.api.InspFacilityAndFileNumberCollisionsDto;
import de.eshg.inspection.facility.api.InspFacilityDto;
import de.eshg.inspection.facility.api.InspLinkBaseFacilityRequest;
import de.eshg.inspection.facility.api.InspLinkBaseFacilityResponse;
import de.eshg.inspection.facility.api.InspPendingFacilitiesOverviewResponse;
import de.eshg.inspection.facility.api.InspPendingFacilityDto;
import de.eshg.inspection.facility.api.InspPendingFacilityKind;
import de.eshg.inspection.facility.api.InspUpdateFacilityRequest;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.facility.persistence.Facility_;
import de.eshg.inspection.facility.persistence.PendingFacilityView;
import de.eshg.inspection.facility.websearch.WebSearchService;
import de.eshg.inspection.facility.websearch.persistence.WebSearchEntry;
import de.eshg.inspection.facility.websearch.persistence.WebSearchEntryStatus;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.incident.persistence.InspectionIncident;
import de.eshg.inspection.incident.persistence.InspectionIncident_;
import de.eshg.inspection.inspection.InspectionFinalizer;
import de.eshg.inspection.inspection.InspectionProgressEntryService;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.api.GetFileNumberCollisionsResponse;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionAppointment_;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacility;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacility_;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.inspection.inspection.persistence.Inspection_;
import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectType_;
import de.eshg.inspection.sample.persistence.InspectionSample;
import de.eshg.inspection.sample.persistence.InspectionSampleMeasurementParameter;
import de.eshg.inspection.sample.persistence.InspectionSampleMeasurementParameter_;
import de.eshg.inspection.sample.persistence.InspectionSamplePreclassification;
import de.eshg.inspection.sample.persistence.InspectionSample_;
import de.eshg.inspection.samplingpoint.SamplingPointClient;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.testhelper.FeatureToggle;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaBuilder.Case;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.ListJoin;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException.NotFound;

@Service
public class FacilityService {
  private static final Logger LOG = LoggerFactory.getLogger(FacilityService.class);

  private static final long KIND_PENDING_RANGE_IN_DAYS = 14;

  private final FacilityRepository facilityRepository;
  private final FacilityClient facilityClient;
  private final SamplingPointClient samplingPointClient;
  private final InspectionService inspectionService;
  private final WebSearchService webSearchService;
  private final Clock clock;
  private final EntityManager entityManager;
  private final InspectionFinalizer inspectionFinalizer;
  private final InspectionRepository inspectionRepository;
  private final FacilityFileNumberService facilityFileNumberService;
  private final FileNumberCollisionService fileNumberCollisionService;
  private final InspectionProgressEntryService inspectionProgressEntryService;
  private final UserApi userApi;
  private final FeatureToggle<InspectionFeature> featureToggle;

  public FacilityService(
      FacilityRepository facilityRepository,
      FacilityClient facilityClient,
      SamplingPointClient samplingPointClient,
      InspectionService inspectionService,
      WebSearchService webSearchService,
      Clock clock,
      EntityManager entityManager,
      InspectionFinalizer inspectionFinalizer,
      InspectionRepository inspectionRepository,
      FacilityFileNumberService facilityFileNumberService,
      //      InspectionFeatureToggle inspectionFeatureToggle,
      FileNumberCollisionService fileNumberCollisionService,
      InspectionProgressEntryService inspectionProgressEntryService,
      UserApi userApi,
      FeatureToggle<InspectionFeature> featureToggle) {
    this.facilityRepository = facilityRepository;
    this.facilityClient = facilityClient;
    this.samplingPointClient = samplingPointClient;
    this.inspectionService = inspectionService;
    this.webSearchService = webSearchService;
    this.clock = clock;
    this.entityManager = entityManager;
    this.inspectionFinalizer = inspectionFinalizer;
    this.inspectionRepository = inspectionRepository;
    this.facilityFileNumberService = facilityFileNumberService;
    this.fileNumberCollisionService = fileNumberCollisionService;
    this.inspectionProgressEntryService = inspectionProgressEntryService;
    this.userApi = userApi;
    this.featureToggle = featureToggle;
  }

  public InspAddFacilityResponse addFacility(InspAddFacilityRequest request) {
    validateFacility(request.baseFacility());

    // call base module to save facility in centralfile
    // Ideally we would like to not create a new facility file state unconditionally here, because
    // we don't need it if we have an existing inspection, but with the current base API it's not
    // feasible to do it in a different way.
    AddFacilityFileStateResponse baseResponse =
        facilityClient.addFacilityFileState(request.baseFacility());

    String fileNumber = facilityFileNumberService.getFileNumber(baseResponse);

    Optional<Facility> matchedInspFacility = findMatchingInspFacility(baseResponse.id());

    // save in db
    Facility facility = FacilityMapper.facilityFrom(baseResponse);

    // If the inspection facility already exists, we don't want to create it again.
    Facility savedFacility = matchedInspFacility.orElseGet(() -> facilityRepository.save(facility));

    InspFacilityDto facilityDTO =
        FacilityMapper.fromAddFacilityResponse(savedFacility, baseResponse, fileNumber);

    Inspection inspection;
    boolean isNew = false;

    if (matchedInspFacility.isEmpty()) {
      LOG.info("addFacility: saved new facility {}", savedFacility.getId());

      // create draft inspection
      isNew = true;
      inspection = inspectionService.createDraftInspection(savedFacility);
    } else {
      LOG.info("addFacility: matched existing facility {}", savedFacility.getId());

      // If we have an inspection for the matched facility, we want to provide the ID, so the
      // frontend can route to it.
      inspection = inspectionService.findNewestOpenInspectionForFacility(savedFacility);
    }

    linkWebSearchFacility(request.webSearchEntryId(), baseResponse.id());

    inspectionService.linkInboxProcedure(request.inboxProcedureId(), inspection);

    UUID inspectionId = inspection.getExternalId();
    ProcedureStatus procedureStatus = inspection.getProcedureStatus();
    return new InspAddFacilityResponse(
        facilityDTO, inspectionId, ProcedureMapper.toInterfaceType(procedureStatus), isNew);
  }

  public void setAssignee(UUID externalId, UUID assigneeId) {
    if (!featureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle SAMPLES is disabled");
    }

    Optional<Facility> optFac = facilityRepository.findByExternalId(externalId);
    if (optFac.isEmpty()) {
      throw new IllegalArgumentException(
          "Facility with externalId " + externalId + " not found in table Inspection.facility");
    }

    // check that user exists, otherwise an erroneous entry in the facility table
    // will block the tab for the sampling points
    userApi.getUser(assigneeId);

    Facility fac = optFac.get();
    fac.setAssigneeId(assigneeId);
    facilityRepository.save(fac);
  }

  public Optional<UserDto> getAssignee(UUID externalId) {
    if (!featureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle SAMPLES is disabled");
    }
    Optional<Facility> optFac = facilityRepository.findByExternalId(externalId);
    if (optFac.isEmpty()) {
      throw new IllegalArgumentException(
          "Facility with externalId " + externalId + " not found in table Inspection.facility");
    }
    Facility fac = optFac.get();
    UUID assigneeId = fac.getAssigneeId();
    if (assigneeId == null) {
      return Optional.empty();
    }
    UserDto user = userApi.getUser(assigneeId);
    return Optional.ofNullable(user);
  }

  InspLinkBaseFacilityResponse linkBaseFacility(InspLinkBaseFacilityRequest request) {
    validateFacility(request.facility());

    List<UUID> fileStateIds =
        facilityClient.getFacilityFileStateIdsAssociatedWithReferenceFacility(
            request.facility().id());

    Optional<Facility> matchedInspFacility = findMatchingInspFacility(fileStateIds);

    Inspection newestInspection;
    UUID centralFileStateId;
    boolean isNew = false;

    if (matchedInspFacility.isEmpty()) {
      AddFacilityFileStateRequest addRequest =
          new AddFacilityFileStateRequest(request.facility(), DataOriginDto.MANUAL);
      AddFacilityFileStateResponse baseFacilityResponse =
          facilityClient.addFacilityFileState(addRequest);
      centralFileStateId = baseFacilityResponse.id();

      Facility facility = FacilityMapper.facilityFrom(baseFacilityResponse);
      Facility savedFacility = facilityRepository.save(facility);
      LOG.info("linkBaseFacility: saved new inspection facility {}", savedFacility.getId());
      isNew = true;
      newestInspection = inspectionService.createDraftInspection(savedFacility);
    } else {
      Facility inspFacility = matchedInspFacility.get();
      centralFileStateId = inspFacility.getOriginalCentralFileStateId();
      newestInspection = inspectionService.findNewestOpenInspectionForFacility(inspFacility);
      if (newestInspection == null) {
        isNew = true;
        newestInspection =
            inspectionFinalizer.createFollowupInspectionIfApplicable(
                inspectionService.findNewestClosedInspectionForFacility(inspFacility));
      }
    }

    linkWebSearchFacility(request.webSearchEntryId(), centralFileStateId);

    inspectionService.linkInboxProcedure(request.inboxProcedureId(), newestInspection);

    return new InspLinkBaseFacilityResponse(
        newestInspection.getExternalId(),
        ProcedureMapper.toInterfaceType(newestInspection.getProcedureStatus()),
        isNew);
  }

  public InspFacilityAndFileNumberCollisionsDto updateFacility(
      UUID externalId, InspUpdateFacilityRequest request) {
    validateFacility(request.baseFacility());

    Inspection inspection = inspectionService.loadInspectionForUpdate(request.procedureId());
    Facility facility = loadFacility(externalId);
    UUID previousFacilityFileStateId = inspection.getRelatedFacility().getCentralFileStateId();
    GetFacilityFileStateResponse baseFacility =
        facilityClient.getFacilityFileState(
            inspection.getRelatedFacility().getCentralFileStateId());

    String fileNumberBefore = facilityFileNumberService.getFileNumber(inspection);

    // call base module to save facility state in central file
    AddFacilityFileStateResponse baseResponse;
    try {
      baseResponse =
          facilityClient.updateFacilityFileStateAndReference(
              previousFacilityFileStateId,
              FacilityMapper.mapAddFacilityFileStateRequestToPutFacilityRequest(
                  request.baseFacility()));
    } catch (BadRequestException e) {
      // For now, we want to keep the old behaviour that we don't throw an exception even if we
      // don't actually change anything
      if (!"Matching reference facility already exists".equals(e.getMessage())) {
        throw e;
      }
      baseResponse = facilityClient.addFacilityFileState(request.baseFacility());
    }

    String fileNumberAfter = facilityFileNumberService.getFileNumber(baseResponse);

    GetFileNumberCollisionsResponse fileNumberCollisionsResponse = null;
    if (!com.google.common.base.Objects.equal(fileNumberBefore, fileNumberAfter)) {
      inspection.setFileNumberSuffix(null);

      if (fileNumberAfter != null
          && baseResponse.contactAddress() instanceof DomesticAddressDto domesticAddress) {
        fileNumberCollisionsResponse =
            fileNumberCollisionService.getPossibleFileNumberCollisionsForFileState(
                baseResponse.id(),
                domesticAddress.postalCode(),
                domesticAddress.street(),
                domesticAddress.houseNumber(),
                true);
      }
    }

    // save in db with new central file state
    Facility savedFacility =
        facilityRepository.save(FacilityMapper.mapFacility(facility, baseResponse, request));
    LOG.info("updated facility {}", savedFacility.getId());

    inspection.getRelatedFacility().setCentralFileStateId(baseResponse.id());
    LOG.info("updated inspection {}", inspection.getId());

    if (!baseFacility.contactAddress().equals(request.baseFacility().contactAddress())) {
      inspectionProgressEntryService.createProgressEntryForUpdateFacility(
          inspection, previousFacilityFileStateId, "Die Adresse der Einrichtung wurde geändert.");
    } else {
      inspectionProgressEntryService.createProgressEntryForUpdateFacility(
          inspection, previousFacilityFileStateId);
    }

    return new InspFacilityAndFileNumberCollisionsDto(
        FacilityMapper.fromAddFacilityResponse(savedFacility, baseResponse, fileNumberAfter),
        fileNumberCollisionsResponse);
  }

  public InspPendingFacilitiesOverviewResponse getPendingFacilities(
      GetPendingFacilitiesFilterOptionsDto params,
      GetPendingFacilitiesPaginationOptionsDto pagination) {
    // We need to fix the time we consider to be "now" for consistently determining the "kind".
    Instant now = clock.instant();

    // early validate page request params
    PageRequest pageRequest = pagination.getPageRequest();

    // We filter for the sort attributes that are stored in base, because we will need to forward
    // that to the base endpoint and we also need it in order to determine if we can paginate in one
    // of the databases.
    List<String> baseSideSorting = getBaseSideSorting(pagination);

    // We determine the pagination mode, which tells us if we can paginate in one of the databases
    // and, if applicable, which one.
    PaginationMode paginationMode = determinePaginationMode(params, pagination, baseSideSorting);
    LOG.debug(
        "Getting pending facilities with params {} and pagination {} with pagination mode: {}",
        params,
        pagination,
        paginationMode);

    List<Long> facilityIdsWithFacilityDuplicate = facilityRepository.getFacilityIdsWithDuplicates();

    List<Long> inspectionIdsWithInspectionDuplicate =
        inspectionRepository.getInspectionIdsWithDuplicates();

    long numberOfDuplicates =
        (long) facilityIdsWithFacilityDuplicate.size()
            + (long) inspectionIdsWithInspectionDuplicate.size();

    List<UUID> samplingPointFileStateIds = Collections.emptyList();
    if (params.zid() != null) {
      samplingPointFileStateIds =
          samplingPointClient
              .searchSamplingPointFileStates(params.zid())
              .samplingPointFileStates()
              .stream()
              .map(GetSamplingPointFileStateResponse::id)
              .toList();
      if (samplingPointFileStateIds == null || samplingPointFileStateIds.isEmpty()) {
        return new InspPendingFacilitiesOverviewResponse(
            0, 0, Collections.emptyList(), numberOfDuplicates);
      }
    }

    List<UUID> centralFileStateIdsForFileNumber = null;
    Integer fileNumberSuffix = null;
    if (params.fileNumber() != null) {
      centralFileStateIdsForFileNumber =
          facilityFileNumberService.getFileStates(params).stream()
              .map(GetFacilityFileStateResponse::id)
              .toList();

      String[] splitString = params.fileNumber().split("-");
      if (splitString.length >= 4) {
        fileNumberSuffix = Integer.parseInt(splitString[3]);
      }
    }

    PendingFacilitiesInspectionDatabaseFilters inspectionDatabaseFilters =
        new PendingFacilitiesInspectionDatabaseFilters(
            params.kind(),
            params.objectTypeId(),
            params.status(),
            params.type(),
            params.phase(),
            params.isBefore(),
            params.isAfter(),
            params.hasDuplicates(),
            params.banned(),
            facilityIdsWithFacilityDuplicate,
            inspectionIdsWithInspectionDuplicate,
            null,
            centralFileStateIdsForFileNumber,
            fileNumberSuffix,
            params.unfinishedSamples(),
            params.suspiciousSamples(),
            samplingPointFileStateIds);

    FindPendingFacilitiesResult inspectionDatabaseResult =
        findPendingFacilities(
            now,
            inspectionDatabaseFilters,
            paginationMode.canPaginateInInspectionDatabase ? pageRequest.getPageNumber() : null,
            paginationMode.canPaginateInInspectionDatabase ? pageRequest.getPageSize() : null,
            paginationMode == PaginationMode.SECONDARY_SORTING_IN_BASE,
            pageRequest.getSort().filter(o -> !isBaseSideSortParameter(o.getProperty())).toList());

    List<PendingFacilityView> candidates = inspectionDatabaseResult.candidates;
    long totalNumberOfElementsAccordingToInspectionDatabase =
        inspectionDatabaseResult.totalNumberOfElements;

    if (LOG.isTraceEnabled()) {
      LOG.trace(
          "candidate ids: {}",
          candidates.stream()
              .map(c -> c.inspection() == null ? null : c.inspection().getId())
              .toList());
    }

    long candidatesToSkipAtBeginning = 0;

    if (paginationMode == PaginationMode.SECONDARY_SORTING_IN_BASE) {
      candidatesToSkipAtBeginning =
          handleSecondarySortingInBase(
              inspectionDatabaseFilters, pagination, pageRequest, now, candidates);
    }

    // fetch centralfile data in a bulk query
    CentralFileData centralFileResponse =
        fetchCentralFileDataFiltered(
            new GetFacilityFileStatesFilteredRequest(
                extractCentralFileStateIds(candidates),
                params.name(),
                params.postalCode(),
                params.city(),
                params.street(),
                null,
                paginationMode.canPaginateInBaseDatabase ? pagination.pageNumber() : null,
                paginationMode.canPaginateInBaseDatabase ? pagination.pageSize() : null,
                paginationMode.canPaginateInBaseDatabase
                    ? baseSideSorting
                    : Collections.emptyList()));

    // We filter out the candidates for which we don't find the central file state id in the
    // response. We don't do this in case we paginated in the inspection database, because
    // in this case, the only entries that will be filtered out will be those were the central
    // file state was deleted. Especially in case of secondary sorting in base, these need
    // to stay in before sorting and cutting off the additional entries at the beginning and
    // end, otherwise this will give wrong results.
    if (!paginationMode.canPaginateInInspectionDatabase) {
      candidates =
          filterCandidatesBasedOnCentralFileStates(
              candidates, centralFileResponse.facilityFileStateMap().keySet());
    }

    // Map to ViewAndDto. We will need the view later in order to sort by the inspection ID (long,
    // not UUID)
    List<ViewAndDto> entries =
        candidates.stream()
            .map(
                e ->
                    new ViewAndDto(
                        e,
                        createInspPendingFacilityDto(
                            e, centralFileResponse.facilityFileStateMap())))
            .toList();

    // Application-side sorting (needed in case we are sorting by base attributes)
    List<InspPendingFacilityDto> result =
        sortAndPageEntries(
            entries,
            centralFileResponse.baseOrderMap,
            pageRequest,
            paginationMode,
            candidatesToSkipAtBeginning);

    // We obtain the total number of entries, which we will get from different sources depending on
    // the pagination mode.
    long totalNumber =
        getTotalNumber(
            paginationMode,
            centralFileResponse,
            entries,
            totalNumberOfElementsAccordingToInspectionDatabase);

    int totalPages = (int) Math.ceil((double) totalNumber / pageRequest.getPageSize());

    return new InspPendingFacilitiesOverviewResponse(
        totalPages, totalNumber, result, numberOfDuplicates);
  }

  record ViewAndDto(PendingFacilityView view, InspPendingFacilityDto dto) {}

  private enum PaginationMode {
    PAGINATION_IN_BASE_DATABASE(true, false),
    PAGINATION_IN_INSPECTION_DATABASE(false, true),
    SECONDARY_SORTING_IN_BASE(false, true),
    MANUAL_PAGINATION(false, false),
    ;

    private final boolean canPaginateInBaseDatabase;
    private final boolean canPaginateInInspectionDatabase;

    PaginationMode(boolean canPaginateInBaseDatabase, boolean canPaginateInInspectionDatabase) {
      this.canPaginateInBaseDatabase = canPaginateInBaseDatabase;
      this.canPaginateInInspectionDatabase = canPaginateInInspectionDatabase;
    }
  }

  private PaginationMode determinePaginationMode(
      GetPendingFacilitiesFilterOptionsDto params,
      GetPendingFacilitiesPaginationOptionsDto pagination,
      List<String> baseSideSorting) {

    // If and only if we have sorting by base side attributes and ONLY by base side attributes, we
    // will paginate in the base database.
    if (!baseSideSorting.isEmpty()
        && baseSideSorting.size() == pagination.getSortOrDefault().size()) {
      return PaginationMode.PAGINATION_IN_BASE_DATABASE;
    }

    // If we already know that we can't paginate in the base database, we will have to use manual
    // pagination if there are any base side filters.
    if (hasBaseSideFilter(params)) {
      return PaginationMode.MANUAL_PAGINATION;
    }

    // We determine if the primary sorting is in base, meaning the first sort parameter in the list
    // is a base attribute. If so, we will also have to use manual pagination as we already know
    // that base side pagination is not possible.
    if ((!baseSideSorting.isEmpty()
            && baseSideSorting.size() < pagination.getSortOrDefault().size())
        && isBaseSideSortParameter(pagination.getSortOrDefault().getFirst())) {
      return PaginationMode.MANUAL_PAGINATION;
    }

    // We check if we have the condition that we have "secondary sorting in base", meaning that in
    // the list of sort parameters, after one or more inspection side attributes we only have base
    // attributes all the way to the end of the list (and at least one of them).
    boolean secondarySortingInBase = false;
    if (!baseSideSorting.isEmpty()
        && baseSideSorting.size() < pagination.getSortOrDefault().size()) {
      boolean stillInInspection = true;
      boolean hasSeenInspection = false;
      for (String s : pagination.getSortOrDefault()) {
        if (isBaseSideSortParameter(s)) {
          // We set stillInInspection to false, marking that we are now past the one or more
          // inspection attributes at the beginning.
          stillInInspection = false;

          // secondarySortingInBase is only true if we have seen inspection attributes before,
          // otherwise this would be PRIMARY sorting in base, which is not what we are looking for
          // here.
          secondarySortingInBase = hasSeenInspection;
        } else {
          // Here we mark that we have seen an inspection attribute, which is needed to check that
          // there are inspection attributes at the beginning of the list.
          hasSeenInspection = true;
          if (!stillInInspection) {
            // In this case, we are not in the group of inspection attributes at the beginning, but
            // rather in a new group behind the base attributes. In this case, we have to use manual
            // pagination. In practice, the frontend won't request this (as of the writing of this
            // comment), but we should still handle this case correctly in case that changes.
            return PaginationMode.MANUAL_PAGINATION;
          }
        }
      }
    }

    // If we have the "secondary sorting in base" we can return that as the pagination mode, which
    // involves pagination in the inspection database, but with complications.
    if (secondarySortingInBase) {
      return PaginationMode.SECONDARY_SORTING_IN_BASE;
    }

    // If we arrive here, we know that paginating in the inspection database is possible.
    return PaginationMode.PAGINATION_IN_INSPECTION_DATABASE;
  }

  private long getTotalNumber(
      PaginationMode paginationMode,
      CentralFileData centralFileResponse,
      List<ViewAndDto> filteredEntries,
      long totalNumberOfElementsAccordingToInspectionDatabase) {
    if (paginationMode.canPaginateInInspectionDatabase) {
      return totalNumberOfElementsAccordingToInspectionDatabase;
    }
    if (paginationMode.canPaginateInBaseDatabase) {
      return centralFileResponse.totalNumberOfElements;
    }
    return filteredEntries.size();
  }

  private long calculateNumberOfCandidatesToSkipAtBeginning(
      GetPendingFacilitiesPaginationOptionsDto pagination,
      long numberOfPreviousAndEqualFacilities,
      long numberOfEqualFacilitiesAtBeginningOfPage,
      long numberOfFacilitiesEqualToFirstOfPage,
      boolean firstAndLastElementAreEqualForSorting) {
    long candidatesToSkipAtBeginning =
        numberOfFacilitiesEqualToFirstOfPage - numberOfEqualFacilitiesAtBeginningOfPage;

    if (pagination.pageSize() == null
        || pagination.pageNumber() == null
        || pagination.pageNumber() == 0) {
      candidatesToSkipAtBeginning = 0;
    } else if (firstAndLastElementAreEqualForSorting) {
      candidatesToSkipAtBeginning =
          (long) pagination.pageNumber() * pagination.pageSize()
              + numberOfFacilitiesEqualToFirstOfPage
              - numberOfPreviousAndEqualFacilities;
    }
    return candidatesToSkipAtBeginning;
  }

  private long handleSecondarySortingInBase(
      PendingFacilitiesInspectionDatabaseFilters inspectionDatabaseFilters,
      GetPendingFacilitiesPaginationOptionsDto pagination,
      PageRequest pageRequest,
      Instant now,
      List<PendingFacilityView> candidates) {
    /*
     * In the case of secondary sorting in base, we have to consider that the
     * page we are getting when fetching from the inspection database is not
     * necessarily the page we should get after sorting by the base attribute.
     *
     * Consider this example where the page size is 4 and we want to sort first
     * by the number of incidents in ascending order, then by name and the pages
     * should look like this:
     *
     * ----------------------------------------------
     * | Inspection ID | Number of incidents | Name |
     * ----------------------------------------------
     * |       8       |          0          |   L  |
     * |       9       |          1          |   K  |
     * |      10       |          2          |   J  |
     * |      12       |          3          |   H  |
     * ----------------------------------------------
     * |      11       |          3          |   I  |
     * |       6       |          4          |   B  |
     * |       5       |          4          |   C  |
     * |       4       |          4          |   D  |
     * ----------------------------------------------
     * |       3       |          4          |   E  |
     * |       2       |          4          |   F  |
     * |       1       |          4          |   G  |
     * |       7       |          5          |   A  |
     * ----------------------------------------------
     *
     * However, while we are only dealing with the inspection database, we can't
     * see the names yet. So all we can do is sort by incidents and then by
     * inspection ID (for having deterministic results), which will give these
     * pages:
     *
     * ----------------------------------------------
     * | Inspection ID | Number of incidents | Name |
     * ----------------------------------------------
     * |       8       |          0          |   L  |
     * |       9       |          1          |   K  |
     * |      10       |          2          |   J  |
     * |      11       |          3          |   I  |
     * ----------------------------------------------
     * |      12       |          3          |   H  |
     * |       1       |          4          |   G  |
     * |       2       |          4          |   F  |
     * |       3       |          4          |   E  |
     * ----------------------------------------------
     * |       4       |          4          |   D  |
     * |       5       |          4          |   C  |
     * |       6       |          4          |   B  |
     * |       7       |          5          |   A  |
     * ----------------------------------------------
     *
     * If we just naively fetch page 1 (starting at 0), we will get this result:
     *
     * ---------------------------------------------------------------
     * | Inspection ID | Number of incidents | Central file state ID |
     * ---------------------------------------------------------------
     * |      12       |          3          |      (some UUID)      |
     * |       1       |          4          |      (some UUID)      |
     * |       2       |          4          |      (some UUID)      |
     * |       3       |          4          |      (some UUID)      |
     * ---------------------------------------------------------------
     *
     * We don't actually see the names until we have fetched them from base. So
     * let's do that:
     *
     * ----------------------------------------------
     * | Inspection ID | Number of incidents | Name |
     * ----------------------------------------------
     * |      12       |          3          |   H  |
     * |       1       |          4          |   G  |
     * |       2       |          4          |   F  |
     * |       3       |          4          |   E  |
     * ----------------------------------------------
     *
     * We can now apply the secondary sort by name:
     *
     * ----------------------------------------------
     * | Inspection ID | Number of incidents | Name |
     * ----------------------------------------------
     * |      12       |          3          |   H  |
     * |       3       |          4          |   E  |
     * |       2       |          4          |   F  |
     * |       1       |          4          |   G  |
     * ----------------------------------------------
     *
     * This may look plausible but it is WRONG! If we look at the table at the
     * top, we see that we have entries where number of incidents is also 4, but
     * have names B, C and D and therefore should be before the ones with names
     * E, F and G! Also, we have our entry with 3 incidents and name H, but that
     * should actually be on the previous page before the entry with name I,
     * which should instead be in our page. So what to do? We need to also
     * consider other entries where the number of incidents are 3 or 4, then
     * sort, then only take the elements that should be part of our page.
     *
     * One thing we already did before calling this method is over provisioning
     * the page, meaning we actually fetched five instead of four entries, so
     * we get something looking like this:
     *
     * ----------------------------------------------
     * | Inspection ID | Number of incidents | Name |
     * ----------------------------------------------
     * |      12       |          3          |   H  |
     * |       1       |          4          |   G  |
     * |       2       |          4          |   F  |
     * |       3       |          4          |   E  |
     * |       4       |          4          |   D  |
     * ----------------------------------------------
     *
     * The last element in this result serves to show us that we need to fetch
     * other entries with 4 incidents. If the last element had e.g. 5 elements
     * we could just ignore it and know that there are no other elements with
     * 4 incidents. For the 3 at the top we don't really know and should check
     * just in case. We don't over provision in that direction in order to not
     * make the difference between the first and later page more complicated.
     *
     * After adding the additional candidates and fetching their names we get:
     *
     * ----------------------------------------------
     * | Inspection ID | Number of incidents | Name |
     * ----------------------------------------------
     * |      11       |          3          |   I  |
     * |      12       |          3          |   H  |
     * |       1       |          4          |   G  |
     * |       2       |          4          |   F  |
     * |       3       |          4          |   E  |
     * |       4       |          4          |   D  |
     * |       5       |          4          |   C  |
     * |       6       |          4          |   B  |
     * ----------------------------------------------
     *
     * We can now sort apply the secondary sort by name:
     *
     * ----------------------------------------------
     * | Inspection ID | Number of incidents | Name |
     * ----------------------------------------------
     * |      12       |          3          |   H  |
     * |      11       |          3          |   I  |
     * |       6       |          4          |   B  |
     * |       5       |          4          |   C  |
     * |       4       |          4          |   D  |
     * |       3       |          4          |   E  |
     * |       2       |          4          |   F  |
     * |       1       |          4          |   G  |
     * ----------------------------------------------
     *
     * Now we need to know what to cut off. In this case you might think it's
     * obvious because only one element with 3 incidents and three elements with
     * 4 incidents were added, but it will be less obvious if all the elements
     * of the page have the same number of incidents. So in general, we need to
     * also fetch a count of the elements which are less or equal to the first
     * element according to the search parameter, in this case meaning the count
     * of elements where the number of incidents is at most 3. This number is in
     * this case 4 and by knowing the page size and number we can correctly cut
     * off the right number of elements at the top and bottom in order to arrive
     * at our final result:
     *
     * ----------------------------------------------
     * | Inspection ID | Number of incidents | Name |
     * ----------------------------------------------
     * |      11       |          3          |   I  |
     * |       6       |          4          |   B  |
     * |       5       |          4          |   C  |
     * |       4       |          4          |   D  |
     * ----------------------------------------------
     * */

    PendingFacilityView lastCandidate = candidates.isEmpty() ? null : candidates.getLast();

    // We create a comparator for comparing PendingFacilityView entries
    // according to the search criteria, while treating base attributes as
    // always equal as we can't see them here anyway. It is very important that
    // this comparator behaves in the same way as the comparisons in the
    // database as well as the comparator for manually sorting in the end,
    // otherwise we will get wrong results, possibly not showing certain entries
    // while showing other entries on more than one page.
    Comparator<PendingFacilityView> viewComparator =
        GetPendingFacilitiesPaginationOptionsDto.createComparatorForPendingFacilityView(
            pageRequest, this, now);

    // We determine the number of facilities at the beginning of the page that
    // are equal to each other, which will be important for knowing which
    // facilities to cut off in the end.
    long numberOfEqualFacilitiesAtBeginningOfPage =
        determineNumberOfEqualFacilitiesAtBeginningOfPage(candidates, viewComparator);

    // We determine the number of facilities in the database that are less than
    // or equal to the first facility in the page, which will be important for
    // knowing which facilities to cut off in the end.
    long numberOfPreviousAndEqualFacilities;
    if (candidates.isEmpty() || pagination.pageNumber() == null || pagination.pageNumber() == 0) {
      numberOfPreviousAndEqualFacilities = 0;
    } else {
      numberOfPreviousAndEqualFacilities =
          findNumberOfPreviousAndEqualFacilities(
              now,
              inspectionDatabaseFilters,
              pageRequest.getSort().filter(o -> !isBaseSideSortParameter(o.getProperty())).toList(),
              candidates.getFirst());
    }

    // We extract the central file state IDs into a set, so we can make sure not
    // to have duplicate elements in our list when adding elements that are
    // equal to the first or last element according to the sorting criteria.
    Set<UUID> centralFileStateIdsFromCandidates =
        candidates.stream()
            .filter(c -> c.irf() != null)
            .map(c -> c.irf().getCentralFileStateId())
            .collect(Collectors.toSet());

    // Here we determine if the last two elements of the page are equal
    // according to the search criteria. As we picked one more element than we
    // actually need for the page, this tells us if we have to look at all the
    // elements that are equal to the last element according to the search
    // criteria.
    boolean lastTwoElementsAreEqualForSorting = false;
    boolean firstAndLastElementAreEqualForSorting = false;
    if (candidates.size() >= 2) {
      lastTwoElementsAreEqualForSorting =
          viewComparator.compare(candidates.get(candidates.size() - 2), candidates.getLast()) == 0;

      firstAndLastElementAreEqualForSorting =
          viewComparator.compare(candidates.getFirst(), candidates.getLast()) == 0;
    }

    // This is just a flag to see if we skipped adding elements that are equal
    // to the first element according to the search criteria, as we might
    // otherwise not add those that are equal to the last element, if the first
    // and last element are equal according to the search criteria.
    boolean skippedAddingEqualToFirst = false;

    // We add the elements that are equal to the first element, if necessary.
    long numberOfFacilitiesEqualToFirstOfPage;
    if (pagination.pageNumber() != null && pagination.pageNumber() > 0 && !candidates.isEmpty()) {
      List<PendingFacilityView> equalToFirstFacilities =
          findEqualFacilities(
              now,
              inspectionDatabaseFilters,
              pageRequest.getSort().filter(o -> !isBaseSideSortParameter(o.getProperty())).toList(),
              candidates.getFirst());

      numberOfFacilitiesEqualToFirstOfPage = equalToFirstFacilities.size();

      List<PendingFacilityView> candidatesToAddFromFront =
          equalToFirstFacilities.stream()
              .filter(
                  c ->
                      c.irf() == null
                          || !centralFileStateIdsFromCandidates.contains(
                              c.irf().getCentralFileStateId()))
              .toList();

      candidates.addAll(candidatesToAddFromFront);
    } else {
      numberOfFacilitiesEqualToFirstOfPage = 0;
      skippedAddingEqualToFirst = true;
    }

    // We add the elements that are equal to the last element, if necessary.
    if (lastTwoElementsAreEqualForSorting
        && (skippedAddingEqualToFirst || !firstAndLastElementAreEqualForSorting)) {
      List<PendingFacilityView> equalToLastFacilities =
          findEqualFacilities(
              now,
              inspectionDatabaseFilters,
              pageRequest.getSort().filter(o -> !isBaseSideSortParameter(o.getProperty())).toList(),
              lastCandidate);

      candidates.addAll(
          equalToLastFacilities.stream()
              .filter(
                  c ->
                      c.irf() == null
                          || !centralFileStateIdsFromCandidates.contains(
                              c.irf().getCentralFileStateId()))
              .toList());
    }

    return calculateNumberOfCandidatesToSkipAtBeginning(
        pagination,
        numberOfPreviousAndEqualFacilities,
        numberOfEqualFacilitiesAtBeginningOfPage,
        numberOfFacilitiesEqualToFirstOfPage,
        firstAndLastElementAreEqualForSorting);
  }

  private int determineNumberOfEqualFacilitiesAtBeginningOfPage(
      List<PendingFacilityView> candidates, Comparator<PendingFacilityView> viewComparator) {
    int numberOfEqualFacilitiesAtBeginningOfPage = candidates.size();
    for (int i = 1; i < candidates.size(); i++) {
      if (viewComparator.compare(candidates.getFirst(), candidates.get(i)) != 0) {
        numberOfEqualFacilitiesAtBeginningOfPage = i;
        break;
      }
    }
    return numberOfEqualFacilitiesAtBeginningOfPage;
  }

  boolean isBaseSideSortParameter(String sortString) {
    String property = sortString.split("\\|")[0];
    return Set.of("zid", "name", "postalCode", "city", "street").contains(property);
  }

  private List<String> getBaseSideSorting(GetPendingFacilitiesPaginationOptionsDto pagination) {
    if (pagination.getSortOrDefault() == null) {
      return Collections.emptyList();
    }
    return pagination.getSortOrDefault().stream().filter(this::isBaseSideSortParameter).toList();
  }

  boolean hasBaseSideFilter(GetPendingFacilitiesFilterOptionsDto filters) {
    // For the purpose of this method, we do not consider file number a base side filter, because
    // for file numbers, we do our search before even reading inspections from the database.
    return filters.zid() != null
        || filters.name() != null
        || filters.postalCode() != null
        || filters.city() != null
        || filters.street() != null;
  }

  private List<PendingFacilityView> filterCandidatesBasedOnCentralFileStates(
      List<PendingFacilityView> candidates, Set<UUID> foundIds) {
    return candidates.stream()
        .filter(facility -> Objects.nonNull(facility.irf()))
        .filter(
            row -> idExists(row.irf().getCentralFileStateId(), row.irf().getExternalId(), foundIds))
        .toList();
  }

  private List<ViewAndDto> filterCandidatesBasedOnCentralFileStatesForViewAndDto(
      List<ViewAndDto> candidates, Set<UUID> foundIds) {
    return candidates.stream()
        .filter(entry -> Objects.nonNull(entry.view.irf()))
        .filter(
            row ->
                idExists(
                    row.view.irf().getCentralFileStateId(),
                    row.view.irf().getExternalId(),
                    foundIds))
        .toList();
  }

  private static boolean idExists(UUID centralFileStateId, UUID externalId, Set<UUID> foundIds) {
    if (foundIds.contains(centralFileStateId)) return true;
    LOG.debug(
        "CentralFileStateID {} not found for inspection ID {}", centralFileStateId, externalId);
    return false;
  }

  private record RootAndJoins(
      Root<Inspection> inspectionRoot,
      Join<Inspection, InspectionRelatedFacility> irfJoin,
      Join<InspectionRelatedFacility, Facility> facilityJoin,
      Join<Inspection, InspectionAppointment> executionAppointmentJoin,
      Join<Inspection, InspectionAppointment> plannedAppointmentJoin,
      Join<Facility, ObjectType> objectTypeJoin) {}

  private RootAndJoins createRootAndJoins(CriteriaQuery<?> cq) {
    Root<Inspection> inspectionRoot = cq.from(Inspection.class);
    Join<Inspection, InspectionRelatedFacility> irfJoin =
        inspectionRoot.join(Inspection_.RELATED_FACILITIES, JoinType.LEFT);
    Join<InspectionRelatedFacility, Facility> facilityJoin =
        irfJoin.join(InspectionRelatedFacility_.facility, JoinType.LEFT);
    Join<Inspection, InspectionAppointment> executionAppointmentJoin =
        inspectionRoot.join(Inspection_.executionAppointment, JoinType.LEFT);
    Join<Inspection, InspectionAppointment> plannedAppointmentJoin =
        inspectionRoot.join(Inspection_.plannedAppointment, JoinType.LEFT);
    Join<Facility, ObjectType> objectTypeJoin =
        facilityJoin.join(Facility_.objectType, JoinType.LEFT);

    return new RootAndJoins(
        inspectionRoot,
        irfJoin,
        facilityJoin,
        executionAppointmentJoin,
        plannedAppointmentJoin,
        objectTypeJoin);
  }

  private List<Predicate> buildPredicates(
      Instant now,
      CriteriaBuilder cb,
      CriteriaQuery<?> cq,
      RootAndJoins rootAndJoins,
      PendingFacilitiesInspectionDatabaseFilters filters) {
    Set<ProcedureStatus> procedureStatus = FacilityMapper.toDomainType(filters.status);

    List<Predicate> predicates = new ArrayList<>();

    // Create Predicates
    if (filters.kind != null && !filters.kind.isEmpty()) {
      predicates.add(buildKindPredicate(cb, rootAndJoins, filters.kind, now));
    }
    if (filters.objectTypeId != null) {
      predicates.add(
          cb.equal(
              rootAndJoins.facilityJoin.get(Facility_.objectType).get(ObjectType_.id),
              filters.objectTypeId));
    }
    if (!isEmpty(procedureStatus)) {
      predicates.add(
          rootAndJoins.inspectionRoot.get(Inspection_.procedureStatus).in(procedureStatus));
    }
    if (!isEmpty(filters.type)) {
      predicates.add(rootAndJoins.inspectionRoot.get(Inspection_.type).in(filters.type));
    }
    if (!isEmpty(filters.phase)) {
      predicates.add(rootAndJoins.inspectionRoot.get(Inspection_.phase).in(filters.phase));
    }
    if (filters.isBefore != null) {
      predicates.add(
          cb.or(
              cb.and(
                  cb.isNotNull(rootAndJoins.executionAppointmentJoin),
                  cb.lessThanOrEqualTo(
                      rootAndJoins.executionAppointmentJoin.get(
                          InspectionAppointment_.appointmentStart),
                      filters.isBefore)),
              cb.and(
                  cb.isNull(rootAndJoins.executionAppointmentJoin),
                  cb.isNotNull(rootAndJoins.plannedAppointmentJoin),
                  cb.lessThanOrEqualTo(
                      rootAndJoins.plannedAppointmentJoin.get(
                          InspectionAppointment_.appointmentStart),
                      filters.isBefore)),
              cb.and(
                  cb.isNull(rootAndJoins.executionAppointmentJoin),
                  cb.isNull(rootAndJoins.plannedAppointmentJoin),
                  cb.lessThanOrEqualTo(
                      cb.literal(LocalDate.ofInstant(clock.instant(), ZoneOffset.UTC)),
                      LocalDate.ofInstant(filters.isBefore, ZoneOffset.UTC)))));
    }
    if (filters.isAfter != null) {
      predicates.add(
          cb.or(
              cb.and(
                  cb.isNotNull(rootAndJoins.executionAppointmentJoin),
                  cb.greaterThanOrEqualTo(
                      rootAndJoins.executionAppointmentJoin.get(
                          InspectionAppointment_.appointmentEnd),
                      filters.isAfter)),
              cb.and(
                  cb.isNull(rootAndJoins.executionAppointmentJoin),
                  cb.isNotNull(rootAndJoins.plannedAppointmentJoin),
                  cb.greaterThanOrEqualTo(
                      rootAndJoins.plannedAppointmentJoin.get(
                          InspectionAppointment_.appointmentEnd),
                      filters.isAfter)),
              cb.and(
                  cb.isNull(rootAndJoins.executionAppointmentJoin),
                  cb.isNull(rootAndJoins.plannedAppointmentJoin),
                  cb.greaterThanOrEqualTo(
                      cb.literal(LocalDate.ofInstant(clock.instant(), ZoneOffset.UTC)),
                      LocalDate.ofInstant(filters.isAfter, ZoneOffset.UTC)))));
    }
    if (filters.facilityExternalId != null) {
      predicates.add(
          rootAndJoins.facilityJoin.get(Facility_.externalId).in(filters.facilityExternalId));
    }

    if (filters.hasDuplicates != null) {
      Predicate hasDuplicatesPredicate =
          cb.or(
              rootAndJoins.inspectionRoot.get(SequencedBaseEntity_.id).in(filters.inspectionIds),
              rootAndJoins
                  .facilityJoin
                  .get(BaseEntity_.id)
                  .in(filters.facilityIdsWithFacilityDuplicate));

      predicates.add(
          filters.hasDuplicates ? hasDuplicatesPredicate : cb.not(hasDuplicatesPredicate));
    }

    if (filters.banned != null) {
      predicates.add(
          cb.equal(rootAndJoins.facilityJoin.get(Facility_.BANNED), cb.literal(filters.banned)));
    }

    if (filters.facilityCentralFileStateIds != null) {
      if (filters.facilityCentralFileStateIds.isEmpty()) {
        predicates.add(cb.or());
      } else {
        predicates.add(
            rootAndJoins
                .irfJoin
                .get(InspectionRelatedFacility_.CENTRAL_FILE_STATE_ID)
                .in(filters.facilityCentralFileStateIds));
      }
    }

    if (filters.fileNumberSuffix != null) {
      predicates.add(
          cb.equal(
              rootAndJoins.inspectionRoot.get(Inspection_.fileNumberSuffix),
              cb.literal(filters.fileNumberSuffix)));
    }

    if (filters.unfinishedSamples != null) {
      Predicate unfinishedSamplesPredicate = buildUnfinishedSamplesPredicate(cb, cq, rootAndJoins);
      if (filters.unfinishedSamples) {
        predicates.add(unfinishedSamplesPredicate);
      } else {
        predicates.add(cb.not(unfinishedSamplesPredicate));
      }
    }

    if (filters.suspiciousSamples != null) {
      Predicate suspiciousSamplesPredicate = buildSuspiciousSamplesPredicate(cb, cq, rootAndJoins);
      if (filters.suspiciousSamples) {
        predicates.add(suspiciousSamplesPredicate);
      } else {
        predicates.add(cb.not(suspiciousSamplesPredicate));
      }
    }

    if (filters.samplingPointFileStateIds != null && !filters.samplingPointFileStateIds.isEmpty()) {
      Predicate samplingPointPredicate =
          buildSamplesWithSelectedSamplingPointPredicate(
              cb, cq, rootAndJoins, filters.samplingPointFileStateIds);
      predicates.add(samplingPointPredicate);
    }

    return predicates;
  }

  private record FindPendingFacilitiesResult(
      long totalNumberOfElements, List<PendingFacilityView> candidates) {}

  private record PendingFacilitiesInspectionDatabaseFilters(
      @Nullable Set<InspPendingFacilityKind> kind,
      @Nullable UUID objectTypeId,
      @Nullable Set<ProcedureStatusDto> status,
      @Nullable Set<InspectionType> type,
      @Nullable Set<InspectionPhase> phase,
      @Nullable Instant isBefore,
      @Nullable Instant isAfter,
      @Nullable Boolean hasDuplicates,
      @Nullable Boolean banned,
      @NotNull List<Long> facilityIdsWithFacilityDuplicate,
      @NotNull List<Long> inspectionIds,
      @Nullable UUID facilityExternalId,
      @Nullable List<UUID> facilityCentralFileStateIds,
      @Nullable Integer fileNumberSuffix,
      @Nullable Boolean unfinishedSamples,
      @Nullable Boolean suspiciousSamples,
      @Nullable List<UUID> samplingPointFileStateIds) {}

  private FindPendingFacilitiesResult findPendingFacilities(
      Instant now,
      PendingFacilitiesInspectionDatabaseFilters filters,
      @Nullable Integer pageNumber,
      @Nullable Integer pageSize,
      @Nullable Boolean overprovisionPage,
      @Nullable List<Sort.Order> orders) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    // We have one query for fetching the facilities in the page and one for fetching the total
    // number
    CriteriaQuery<PendingFacilityView> cq = cb.createQuery(PendingFacilityView.class);
    CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);

    // We create the root and joins for both queries.
    RootAndJoins rootAndJoins = createRootAndJoins(cq);
    RootAndJoins rootAndJoinsForCount = createRootAndJoins(countQuery);

    // We create the filter predicates for both queries.
    List<Predicate> predicates = buildPredicates(now, cb, cq, rootAndJoins, filters);
    List<Predicate> predicatesForCount =
        buildPredicates(now, cb, cq, rootAndJoinsForCount, filters);

    // For the incidents we need a special subquery because it is not stored as an integer in the
    // inspection, but rather we have to count the number of entries in the incidents table that
    // have the specific foreign key for the inspection.
    Subquery<Long> incidentsSubquery = buildIncidentsSubquery(cb, cq, rootAndJoins);

    cq.select(
        cb.construct(
            PendingFacilityView.class,
            rootAndJoins.facilityJoin,
            rootAndJoins.irfJoin,
            rootAndJoins.inspectionRoot));
    cq.where(cb.and(predicates.toArray(Predicate[]::new)));

    if (orders != null && !orders.isEmpty()) {
      cq.orderBy(
          Streams.concat(
                  orders.stream()
                      .map(
                          order ->
                              getOrderFromSortOrder(
                                  cb, order, rootAndJoins, incidentsSubquery, now)),
                  Stream.of(cb.asc(rootAndJoins.inspectionRoot.get(Inspection_.id))))
              .toList());
    } else {
      cq.orderBy(cb.asc(rootAndJoins.inspectionRoot.get(Inspection_.id)));
    }

    countQuery.select(cb.count(rootAndJoinsForCount.inspectionRoot));
    countQuery.where(cb.and(predicatesForCount.toArray(Predicate[]::new)));

    TypedQuery<PendingFacilityView> query = entityManager.createQuery(cq);

    long totalCount;
    if (pageNumber != null && pageSize != null) {
      query.setFirstResult(pageNumber * pageSize);

      // In the case of secondary sorting in base we want to fetch an additional element at the end
      // of the page in order so see if it is equal to the last element of the page according to the
      // sorting criteria. If it is, it could actually be the case that an element that would come
      // after the page from our database query would actually have to be in our page when we sort
      // by the base attribute. This case has to be specially handled.
      if (Boolean.TRUE.equals(overprovisionPage)) {
        query.setMaxResults(pageSize + 1);
      } else {
        query.setMaxResults(pageSize);
      }

      // We only need to actually call the count query if we paginate.
      totalCount = entityManager.createQuery(countQuery).getSingleResult();
    } else {
      // If we don't paginate, the total number is just the number of rows we get.
      totalCount = query.getResultList().size();
    }

    return new FindPendingFacilitiesResult(totalCount, query.getResultList());
  }

  private record ExpressionPair<T, U>(
      Expression<T> firstExpression, Expression<U> secondExpression) {}

  private ExpressionPair<?, ?> getEqualnessExpressionPair(
      CriteriaBuilder cb,
      RootAndJoins rootAndJoins,
      Subquery<Long> incidentsSubquery,
      Sort.Order order,
      PendingFacilityView candidate,
      Instant now) {
    // We want to get the two expressions that should be equal if we are looking for elements that
    // are equal to another according to the search criteria. For null values, we just use null
    // instead of a null literal as nulls need to be treated differently in SQL.
    return switch (order.getProperty()) {
      case "inspection_numberOfIncidents" ->
          new ExpressionPair<>(
              incidentsSubquery, cb.literal(candidate.inspection().getIncidents().size()));
      case "inspection_phase" ->
          new ExpressionPair<>(
              rootAndJoins.inspectionRoot.get(Inspection_.phase),
              cb.literal(candidate.inspection().getPhase()));
      case "inspection_type" ->
          new ExpressionPair<>(
              rootAndJoins.inspectionRoot.get(Inspection_.type),
              cb.literal(candidate.inspection().getType()));
      case "inspection_status" ->
          new ExpressionPair<>(
              rootAndJoins.inspectionRoot.get(Inspection_.procedureStatus),
              cb.literal(candidate.inspection().getProcedureStatus()));
      case "objecttype_name", "objectTypeId" ->
          // For objectTypeId the behaviour has always been that is actually sorts by name, so we
          // keep it here as well.
          new ExpressionPair<>(
              rootAndJoins.objectTypeJoin.get(ObjectType_.name),
              candidate.facility().getObjectType() == null
                  ? null
                  : cb.literal(candidate.facility().getObjectType().getName()));
      case "kind" -> {
        // kind needs special treatment because it is calculated from other attributes
        InspPendingFacilityKind kind =
            determineInspPendingFacilityKind(candidate, getPlannedFrom(candidate), now);
        yield new ExpressionPair<>(
            kindSortExpression(cb, rootAndJoins, now),
            kind != null
                ? cb.literal(kind.ordinal())
                : cb.literal(InspPendingFacilityKind.values().length));
      }
      default -> null;
    };
  }

  private Predicate buildPredicateForEqualness(
      CriteriaBuilder cb,
      RootAndJoins rootAndJoins,
      Subquery<Long> incidentsSubquery,
      Sort.Order order,
      PendingFacilityView candidate,
      Instant now) {
    ExpressionPair<?, ?> expressionPair =
        getEqualnessExpressionPair(cb, rootAndJoins, incidentsSubquery, order, candidate, now);

    if (expressionPair == null) {
      return cb.and();
    } else if (expressionPair.secondExpression == null) {
      return cb.isNull(expressionPair.firstExpression);
    } else {
      return cb.equal(expressionPair.firstExpression, expressionPair.secondExpression);
    }
  }

  private List<Predicate> buildPredicatesForEqualness(
      CriteriaBuilder cb,
      RootAndJoins rootAndJoins,
      Subquery<Long> incidentsSubquery,
      List<Sort.Order> orders,
      PendingFacilityView candidate,
      Instant now) {
    List<Predicate> predicates = new ArrayList<>();
    for (Sort.Order order : orders) {
      predicates.add(
          buildPredicateForEqualness(cb, rootAndJoins, incidentsSubquery, order, candidate, now));
    }
    return predicates;
  }

  @SuppressWarnings({"unchecked", "rawtypes"})
  private Predicate buildPredicateForPreviousOrEqualness(
      CriteriaBuilder cb,
      RootAndJoins rootAndJoins,
      Subquery<Long> incidentsSubquery,
      Sort.Order order,
      PendingFacilityView candidate,
      Instant now) {
    ExpressionPair expressionPair =
        getEqualnessExpressionPair(cb, rootAndJoins, incidentsSubquery, order, candidate, now);

    if (expressionPair == null) {
      return cb.and();
    } else if (expressionPair.secondExpression == null) {
      if (order.isAscending()) {
        // If the order is ascending, nulls are last, so all are null or before null
        return cb.and();
      } else {
        // If the order is descending, nulls are first, so only null values are null or before null
        return cb.isNull(expressionPair.firstExpression);
      }
    } else {
      if (order.isAscending()) {
        return cb.lessThanOrEqualTo(
            expressionPair.firstExpression, expressionPair.secondExpression);
      } else {
        return cb.or(
            cb.greaterThanOrEqualTo(
                expressionPair.firstExpression, expressionPair.secondExpression),
            cb.isNull(expressionPair.firstExpression));
      }
    }
  }

  private List<Predicate> buildPredicatesForPreviousOrEqualness(
      CriteriaBuilder cb,
      RootAndJoins rootAndJoins,
      Subquery<Long> incidentsSubquery,
      List<Sort.Order> orders,
      PendingFacilityView candidate,
      Instant now) {
    List<Predicate> predicates = new ArrayList<>();
    for (Sort.Order order : orders) {
      predicates.add(
          buildPredicateForPreviousOrEqualness(
              cb, rootAndJoins, incidentsSubquery, order, candidate, now));
    }
    return predicates;
  }

  private Predicate buildKindPredicate(
      CriteriaBuilder cb,
      RootAndJoins rootAndJoins,
      Set<InspPendingFacilityKind> kinds,
      Instant now) {
    // Kind needs a more complicated predicate because it is calculated from other attributes.

    if (kinds == null || kinds.isEmpty()) {
      return cb.and();
    }
    List<Predicate> predicates = new ArrayList<>();
    if (kinds.contains(InspPendingFacilityKind.NEW)) {
      predicates.add(buildPredicateForKindNew(cb, rootAndJoins));
    }
    if (kinds.contains(InspPendingFacilityKind.PENDING)) {
      predicates.add(buildPredicateForKindPending(cb, rootAndJoins, now));
    }
    if (kinds.contains(InspPendingFacilityKind.OVERDUE)) {
      predicates.add(buildPredicateForKindOverdue(cb, rootAndJoins, now));
    }
    return cb.or(predicates.toArray(Predicate[]::new));
  }

  private Predicate buildPredicateForKindNew(CriteriaBuilder cb, RootAndJoins rootAndJoins) {
    return cb.equal(
        rootAndJoins.inspectionRoot.get(Inspection_.phase), cb.literal(InspectionPhase.NEW));
  }

  private Predicate buildPredicateForKindOverdue(
      CriteriaBuilder cb, RootAndJoins rootAndJoins, Instant now) {
    LocalDate today = toLocalDate(now);
    Instant startOfNextDay = today.plusDays(1).atStartOfDay(clock.getZone()).toInstant();
    return cb.and(
        cb.notEqual(
            rootAndJoins.inspectionRoot.get(Inspection_.phase), cb.literal(InspectionPhase.CLOSED)),
        cb.lessThan(
            rootAndJoins.plannedAppointmentJoin.get(InspectionAppointment_.appointmentStart),
            cb.literal(startOfNextDay)));
  }

  private Predicate buildPredicateForKindPending(
      CriteriaBuilder cb, RootAndJoins rootAndJoins, Instant now) {
    LocalDate today = toLocalDate(now);
    Instant startOfNextDay = today.plusDays(1).atStartOfDay(clock.getZone()).toInstant();
    Instant endOfPendingInterval =
        today.plusDays(KIND_PENDING_RANGE_IN_DAYS).atStartOfDay(clock.getZone()).toInstant();
    return cb.and(
        cb.notEqual(
            rootAndJoins.inspectionRoot.get(Inspection_.phase), cb.literal(InspectionPhase.CLOSED)),
        cb.lessThan(
            rootAndJoins.plannedAppointmentJoin.get(InspectionAppointment_.appointmentStart),
            cb.literal(endOfPendingInterval)),
        cb.greaterThanOrEqualTo(
            rootAndJoins.plannedAppointmentJoin.get(InspectionAppointment_.appointmentStart),
            cb.literal(startOfNextDay)));
  }

  private Subquery<Long> buildIncidentsSubquery(
      CriteriaBuilder cb, CriteriaQuery<?> cq, RootAndJoins rootAndJoins) {
    Subquery<Long> incidentsSubquery = cq.subquery(Long.class);
    Root<Inspection> incidentsSubRoot = incidentsSubquery.from(Inspection.class);
    ListJoin<Inspection, InspectionIncident> subIncidentsJoin =
        incidentsSubRoot.join(Inspection_.incidents);
    incidentsSubquery.select(cb.count(subIncidentsJoin.get(InspectionIncident_.id)));
    incidentsSubquery.where(
        cb.equal(
            rootAndJoins.inspectionRoot.get(Inspection_.id), incidentsSubRoot.get(Inspection_.id)));
    return incidentsSubquery;
  }

  private Predicate buildSamplesWithSelectedSamplingPointPredicate(
      CriteriaBuilder cb,
      CriteriaQuery<?> cq,
      RootAndJoins rootAndJoins,
      List<UUID> samplingPointFileStateIds) {
    Subquery<Long> samplesForSamplingPointSubquery = cq.subquery(Long.class);

    Root<Inspection> samplesSubRoot = samplesForSamplingPointSubquery.from(Inspection.class);
    ListJoin<Inspection, InspectionSample> subSamplesJoin =
        samplesSubRoot.join(Inspection_.samples);

    return cb.exists(
        samplesForSamplingPointSubquery
            .select(cb.literal(1L))
            .where(
                cb.and(
                    cb.equal(
                        rootAndJoins.inspectionRoot.get(Inspection_.id),
                        samplesSubRoot.get(Inspection_.id)),
                    subSamplesJoin
                        .get(InspectionSample_.samplingPointId)
                        .in(samplingPointFileStateIds))));
  }

  private Predicate buildUnfinishedSamplesPredicate(
      CriteriaBuilder cb, CriteriaQuery<?> cq, RootAndJoins rootAndJoins) {
    Subquery<Long> unfinishedSamplesSubquery = cq.subquery(Long.class);
    Root<Inspection> samplesSubRoot = unfinishedSamplesSubquery.from(Inspection.class);
    ListJoin<Inspection, InspectionSample> subSamplesJoin =
        samplesSubRoot.join(Inspection_.samples);
    ListJoin<InspectionSample, InspectionSampleMeasurementParameter> subMeasurementParametersJoin =
        subSamplesJoin.join(InspectionSample_.measurementParameters);

    return cb.exists(
        unfinishedSamplesSubquery
            .select(cb.literal(1L))
            .where(
                cb.and(
                    cb.equal(
                        rootAndJoins.inspectionRoot.get(Inspection_.id),
                        samplesSubRoot.get(Inspection_.id)),
                    cb.isNull(
                        subMeasurementParametersJoin.get(
                            InspectionSampleMeasurementParameter_.measurementValue)))));
  }

  private Predicate buildSuspiciousSamplesPredicate(
      CriteriaBuilder cb, CriteriaQuery<?> cq, RootAndJoins rootAndJoins) {
    Subquery<Long> suspiciousSamplesSubquery = cq.subquery(Long.class);
    Root<Inspection> samplesSubRoot = suspiciousSamplesSubquery.from(Inspection.class);
    ListJoin<Inspection, InspectionSample> subSamplesJoin =
        samplesSubRoot.join(Inspection_.samples);
    ListJoin<InspectionSample, InspectionSampleMeasurementParameter> subMeasurementParametersJoin =
        subSamplesJoin.join(InspectionSample_.measurementParameters);

    return cb.exists(
        suspiciousSamplesSubquery
            .select(cb.literal(1L))
            .where(
                cb.and(
                    cb.equal(
                        rootAndJoins.inspectionRoot.get(Inspection_.id),
                        samplesSubRoot.get(Inspection_.id)),
                    cb.or(
                        cb.equal(
                            subMeasurementParametersJoin.get(
                                InspectionSampleMeasurementParameter_.preclassification),
                            cb.literal(InspectionSamplePreclassification.TOO_LOW)),
                        cb.equal(
                            subMeasurementParametersJoin.get(
                                InspectionSampleMeasurementParameter_.preclassification),
                            cb.literal(InspectionSamplePreclassification.TOO_HIGH))))));
  }

  private List<PendingFacilityView> findEqualFacilities(
      Instant now,
      PendingFacilitiesInspectionDatabaseFilters filters,
      @NotNull List<Sort.Order> orders,
      PendingFacilityView candidate) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    CriteriaQuery<PendingFacilityView> cq = cb.createQuery(PendingFacilityView.class);

    RootAndJoins rootAndJoins = createRootAndJoins(cq);

    List<Predicate> predicates =
        new ArrayList<>(buildPredicates(now, cb, cq, rootAndJoins, filters));

    // For the incidents we need a special subquery because it is not stored as an integer in the
    // inspection, but rather we have to count the number of entries in the incidents table that
    // have the specific foreign key for the inspection.
    Subquery<Long> incidentsSubquery = buildIncidentsSubquery(cb, cq, rootAndJoins);

    predicates.addAll(
        buildPredicatesForEqualness(cb, rootAndJoins, incidentsSubquery, orders, candidate, now));

    cq.select(
        cb.construct(
            PendingFacilityView.class,
            rootAndJoins.facilityJoin,
            rootAndJoins.irfJoin,
            rootAndJoins.inspectionRoot));
    cq.where(cb.and(predicates.toArray(Predicate[]::new)));

    TypedQuery<PendingFacilityView> query = entityManager.createQuery(cq);
    return query.getResultList();
  }

  private long findNumberOfPreviousAndEqualFacilities(
      Instant now,
      PendingFacilitiesInspectionDatabaseFilters filters,
      @NotNull List<Sort.Order> orders,
      PendingFacilityView candidate) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    CriteriaQuery<Long> cq = cb.createQuery(Long.class);

    RootAndJoins rootAndJoins = createRootAndJoins(cq);

    List<Predicate> predicates =
        new ArrayList<>(buildPredicates(now, cb, cq, rootAndJoins, filters));

    // For the incidents we need a special subquery because it is not stored as an integer in the
    // inspection, but rather we have to count the number of entries in the incidents table that
    // have the specific foreign key for the inspection.
    Subquery<Long> incidentsSubquery = buildIncidentsSubquery(cb, cq, rootAndJoins);

    predicates.addAll(
        buildPredicatesForPreviousOrEqualness(
            cb, rootAndJoins, incidentsSubquery, orders, candidate, now));

    cq.select(cb.count(rootAndJoins.inspectionRoot));
    cq.where(cb.and(predicates.toArray(Predicate[]::new)));
    return entityManager.createQuery(cq).getSingleResult();
  }

  private Order getOrderFromSortOrder(
      CriteriaBuilder cb,
      Sort.Order order,
      RootAndJoins rootAndJoins,
      Subquery<Long> incidentsSubquery,
      Instant now) {
    // For all enums, we build a special expression that returns their ordinals, in order to make
    // sure that they are sorted the same way they would be in Java. In theory, this should already
    // be the case, but it looks like it is not.

    if ("inspection_numberOfIncidents".equals(order.getProperty())) {
      if (order.isAscending()) {
        return cb.asc(incidentsSubquery);
      } else {
        return cb.desc(incidentsSubquery);
      }
    } else if ("kind".equals(order.getProperty())) {
      if (order.isAscending()) {
        return cb.asc(kindSortExpression(cb, rootAndJoins, now));
      } else {
        return cb.desc(kindSortExpression(cb, rootAndJoins, now));
      }
    } else if ("inspection_type".equals(order.getProperty())) {
      if (order.isAscending()) {
        return cb.asc(inspectionTypeSortExpression(cb, rootAndJoins));
      } else {
        return cb.desc(inspectionTypeSortExpression(cb, rootAndJoins));
      }
    } else if ("inspection_status".equals(order.getProperty())) {
      if (order.isAscending()) {
        return cb.asc(inspectionStatusSortExpression(cb, rootAndJoins));
      } else {
        return cb.desc(inspectionStatusSortExpression(cb, rootAndJoins));
      }
    } else if ("inspection_phase".equals(order.getProperty())) {
      if (order.isAscending()) {
        return cb.asc(inspectionPhaseSortExpression(cb, rootAndJoins));
      } else {
        return cb.desc(inspectionPhaseSortExpression(cb, rootAndJoins));
      }
    } else {
      return order.isAscending()
          ? cb.asc(
              getFromFromOrderProperty(order.getProperty(), rootAndJoins)
                  .get(getPropertyFromOrderProperty(order.getProperty())))
          : cb.desc(
              getFromFromOrderProperty(order.getProperty(), rootAndJoins)
                  .get(getPropertyFromOrderProperty(order.getProperty())));
    }
  }

  private From<?, ?> getFromFromOrderProperty(String property, RootAndJoins rootAndJoins) {
    if ("plannedFrom".equals(property)) {
      return rootAndJoins.plannedAppointmentJoin;
    }
    if ("objectTypeId".equals(property) || "objecttype_name".equals(property)) {
      return rootAndJoins.objectTypeJoin;
    }

    return rootAndJoins.inspectionRoot;
  }

  private String getPropertyFromOrderProperty(String property) {
    return switch (property) {
      case "plannedFrom" -> "appointmentStart";
      case "inspection_status" -> "procedureStatus";
      case "inspection_type" -> "type";
      case "inspection_phase" -> "phase";
      case "objectTypeId" -> "name";
      case "objecttype_name" -> "name";
      default -> property;
    };
  }

  private Expression<?> inspectionTypeSortExpression(
      CriteriaBuilder cb, RootAndJoins rootAndJoins) {
    Case<Object> selectCase = cb.selectCase();
    for (InspectionType inspectionType : InspectionType.values()) {
      selectCase =
          selectCase.when(
              cb.equal(
                  rootAndJoins.inspectionRoot.get(Inspection_.type), cb.literal(inspectionType)),
              cb.literal(inspectionType.ordinal()));
    }
    selectCase.otherwise(cb.literal(InspectionType.values().length));

    return selectCase;
  }

  private Expression<?> inspectionStatusSortExpression(
      CriteriaBuilder cb, RootAndJoins rootAndJoins) {
    Case<Object> selectCase = cb.selectCase();
    for (ProcedureStatus inspectionStatus : ProcedureStatus.values()) {
      selectCase =
          selectCase.when(
              cb.equal(
                  rootAndJoins.inspectionRoot.get(Inspection_.procedureStatus),
                  cb.literal(inspectionStatus)),
              cb.literal(inspectionStatus.ordinal()));
    }
    selectCase.otherwise(cb.literal(ProcedureStatus.values().length));

    return selectCase;
  }

  private Expression<?> inspectionPhaseSortExpression(
      CriteriaBuilder cb, RootAndJoins rootAndJoins) {
    Case<Object> selectCase = cb.selectCase();
    for (InspectionPhase phase : InspectionPhase.values()) {
      selectCase =
          selectCase.when(
              cb.equal(rootAndJoins.inspectionRoot.get(Inspection_.phase), cb.literal(phase)),
              cb.literal(phase.ordinal()));
    }
    selectCase.otherwise(cb.literal(InspectionPhase.values().length));

    return selectCase;
  }

  private Expression<?> kindSortExpression(
      CriteriaBuilder cb, RootAndJoins rootAndJoins, Instant now) {
    // We get the ordinals of the different kinds, in order to make sure that they are sorted by
    // their position in the enum, just like the comparision in Java would.
    return cb.selectCase()
        .when(
            buildPredicateForKindNew(cb, rootAndJoins),
            cb.literal(InspPendingFacilityKind.NEW.ordinal()))
        .when(
            buildPredicateForKindPending(cb, rootAndJoins, now),
            cb.literal(InspPendingFacilityKind.PENDING.ordinal()))
        .when(
            buildPredicateForKindOverdue(cb, rootAndJoins, now),
            cb.literal(InspPendingFacilityKind.OVERDUE.ordinal()))
        .otherwise(cb.literal(InspPendingFacilityKind.values().length));
  }

  private Facility loadFacility(UUID externalId) {
    return facilityRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Facility not found"));
  }

  public Map<UUID, GetFacilityFileStateResponse> fetchCentralFileData(
      List<UUID> centralFileStateIds) {
    if (centralFileStateIds.isEmpty()) return Map.of();
    return facilityClient.getFacilityFileStates(centralFileStateIds).stream()
        .collect(toUnmodifiableMap(GetFacilityFileStateResponse::id, facility -> facility));
  }

  private record CentralFileData(
      long totalNumberOfElements,
      Map<UUID, GetFacilityFileStateResponse> facilityFileStateMap,
      Map<UUID, Integer> baseOrderMap) {}

  private CentralFileData fetchCentralFileDataFiltered(
      GetFacilityFileStatesFilteredRequest request) {
    if (request.fileStateIds() != null && request.fileStateIds().isEmpty()) {
      return new CentralFileData(0L, Map.of(), Map.of());
    }

    var response = facilityClient.getFacilityFileStatesFiltered(request);

    var facilityFileStates = response.facilityFileStates();

    Map<UUID, GetFacilityFileStateResponse> map =
        facilityFileStates.stream()
            .collect(toUnmodifiableMap(GetFacilityFileStateResponse::id, facility -> facility));

    Map<UUID, Integer> orderMap = new HashMap<>();
    for (int i = 0; i < facilityFileStates.size(); i++) {
      orderMap.put(facilityFileStates.get(i).id(), i);
    }

    return new CentralFileData(response.totalNumberOfElements(), map, orderMap);
  }

  private static List<UUID> extractCentralFileStateIds(List<PendingFacilityView> list) {
    return list.stream()
        .flatMap(e -> Stream.of(e.irf() != null ? e.irf().getCentralFileStateId() : null))
        .filter(Objects::nonNull)
        .distinct()
        .toList();
  }

  public Instant getPlannedFrom(PendingFacilityView view) {
    InspectionAppointment plannedAppointment = getPlannedAppointment(view);

    return plannedAppointment == null ? null : plannedAppointment.getAppointmentStart();
  }

  private InspPendingFacilityDto createInspPendingFacilityDto(
      PendingFacilityView view, Map<UUID, GetFacilityFileStateResponse> centralFileData) {
    Instant now = clock.instant();

    Instant plannedFrom = getPlannedFrom(view);

    InspPendingFacilityKind kind = determineInspPendingFacilityKind(view, plannedFrom, now);

    UUID centralFileStateId =
        view.irf() != null
            ? view.irf().getCentralFileStateId()
            : view.facility().getOriginalCentralFileStateId();
    GetFacilityFileStateResponse facilityDto = centralFileData.get(centralFileStateId);
    ObjectType objectType = view.facility().getObjectType();
    ObjectTypeRefDto objecttype =
        objectType != null ? new ObjectTypeRefDto(objectType.getId(), objectType.getName()) : null;
    InspectionAppointment executionAppointment = getExecutionAppointment(view);
    Instant executionFrom =
        executionAppointment == null ? null : executionAppointment.getAppointmentStart();

    return FacilityMapper.createInspPendingFacilityDto(
        view,
        creatDummyContactAddressIfEmpty(facilityDto),
        kind,
        plannedFrom,
        objecttype,
        executionFrom);
  }

  private GetFacilityFileStateResponse creatDummyContactAddressIfEmpty(
      GetFacilityFileStateResponse facilityDto) {
    if (facilityDto == null) {
      return new GetFacilityFileStateResponse(
          UUID.randomUUID(),
          null,
          Collections.emptyList(),
          Collections.emptyList(),
          0L,
          Collections.emptyList(),
          new DomesticAddressDto(CountryCode.DE, null, null, null, null),
          null,
          null,
          DataOriginDto.MANUAL);
    }

    if (facilityDto.contactAddress() != null) return facilityDto;

    // Build empty Address to prevent crash in facility overview, if base module has none
    return new GetFacilityFileStateResponse(
        facilityDto.id(),
        facilityDto.name(),
        facilityDto.emailAddresses(),
        facilityDto.phoneNumbers(),
        facilityDto.referenceVersion(),
        facilityDto.contactPersons(),
        new DomesticAddressDto(CountryCode.DE, "", "", "", ""),
        facilityDto.differentBillingAddress(),
        null,
        facilityDto.dataOrigin());
  }

  public InspPendingFacilityKind determineInspPendingFacilityKind(
      PendingFacilityView view, Instant plannedFrom, Instant now) {
    if (view.inspection() == null
        || plannedFrom == null
        || view.inspection().getPhase() == InspectionPhase.NEW) {
      return InspPendingFacilityKind.NEW;
    }
    if (InspectionPhase.CLOSED.equals(view.inspection().getPhase())) return null;

    if (isOverdue(plannedFrom, now)) return InspPendingFacilityKind.OVERDUE;
    if (isPending(plannedFrom, now)) return InspPendingFacilityKind.PENDING;

    return null;
  }

  private boolean isOverdue(Instant plannedFrom, Instant now) {
    LocalDate plannedFromDate = toLocalDate(plannedFrom);
    LocalDate today = toLocalDate(now);
    return plannedFromDate.isBefore(today) || plannedFromDate.isEqual(today);
  }

  private boolean isPending(Instant plannedFrom, Instant now) {
    LocalDate plannedFromDate = toLocalDate(plannedFrom);
    LocalDate today = toLocalDate(now);
    return plannedFromDate.isBefore(today.plusDays(KIND_PENDING_RANGE_IN_DAYS))
        && plannedFromDate.isAfter(today);
  }

  private LocalDate toLocalDate(Instant instant) {
    return instant.atZone(clock.getZone()).toLocalDate();
  }

  private static InspectionAppointment getPlannedAppointment(PendingFacilityView view) {
    return view.inspection() != null && view.inspection().getPlannedAppointment() != null
        ? view.inspection().getPlannedAppointment()
        : null;
  }

  private static InspectionAppointment getExecutionAppointment(PendingFacilityView view) {
    return view.inspection() != null && view.inspection().getExecutionAppointment() != null
        ? view.inspection().getExecutionAppointment()
        : null;
  }

  private void linkWebSearchFacility(UUID webSearchEntryId, UUID centralFileStateId) {
    if (webSearchEntryId != null) {
      try {
        WebSearchEntry webSearchEntry = webSearchService.findWebSearchEntry(webSearchEntryId);
        // create a new "sachstand" for the base facility
        UUID newFileStateId = facilityClient.createNewFacilityFileState(centralFileStateId);
        webSearchEntry.setCentralFileStateId(newFileStateId);
        webSearchEntry.setStatus(WebSearchEntryStatus.SAVED);
      } catch (NotFoundException e) {
        LOG.error(
            "Could not link facility {} to web search entry {}",
            centralFileStateId,
            webSearchEntryId,
            e);
        throw new BadRequestException("Could not link facility to web wearch entry");
      }
    }
  }

  private List<InspPendingFacilityDto> sortAndPageEntries(
      List<ViewAndDto> entries,
      Map<UUID, Integer> baseOrderMap,
      PageRequest pageRequest,
      PaginationMode paginationMode,
      long candidatesToSkipAtBeginning) {
    Comparator<InspPendingFacilityDto> dtoComparator =
        GetPendingFacilitiesPaginationOptionsDto.createComparator(pageRequest);

    Comparator<ViewAndDto> dtoComparatorForViewAndDto =
        (e1, e2) -> dtoComparator.compare(e1.dto(), e2.dto());

    // For getting consistent sorting results, we should sort by the ID (long, UUID) last. However,
    // if we paginated in the base database, this should be the facility ID in base. We can't access
    // this ID, but we can get an (overall) equivalent sorting by using the order in which we
    // received the facility file states from base.
    Comparator<ViewAndDto> idComparatorForViewAndDto =
        paginationMode.canPaginateInBaseDatabase
            ? Comparator.comparing(e -> baseOrderMap.get(e.view.irf().getCentralFileStateId()))
            : Comparator.comparing(e -> e.view.inspection().getId());

    Stream<ViewAndDto> entriesStream =
        entries.stream()
            .sorted(dtoComparatorForViewAndDto.thenComparing(idComparatorForViewAndDto));

    if (paginationMode.canPaginateInInspectionDatabase) {
      entriesStream = entriesStream.skip(candidatesToSkipAtBeginning);
    } else if (!paginationMode.canPaginateInBaseDatabase) {
      entriesStream =
          entriesStream.skip((long) pageRequest.getPageNumber() * (long) pageRequest.getPageSize());
    }

    List<ViewAndDto> result = entriesStream.limit(pageRequest.getPageSize()).toList();

    result = filterCandidatesBasedOnCentralFileStatesForViewAndDto(result, baseOrderMap.keySet());

    if (LOG.isTraceEnabled()) {
      LOG.trace("result ids: {}", result.stream().map(e -> e.view.inspection().getId()).toList());
    }

    return result.stream().map(e -> e.dto).toList();
  }

  private Optional<Facility> findMatchingInspFacility(
      List<UUID> relatedBaseFacilityIds, UUID centralFileStateId) {
    List<Facility> matchedInspFacilities =
        facilityRepository.findAllByOriginalCentralFileStateIdIn(relatedBaseFacilityIds);

    if (matchedInspFacilities.size() > 1) {
      if (centralFileStateId != null) {
        throw new IllegalStateException(
            String.format(
                "Found %s matching inspection facilities for centralFileStateId %s",
                matchedInspFacilities.size(), centralFileStateId));
      } else {
        throw new IllegalStateException(
            String.format(
                "Found %s matching inspection facilities for relatedBaseFacilityIds %s",
                matchedInspFacilities.size(), relatedBaseFacilityIds));
      }
    }

    if (matchedInspFacilities.isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(matchedInspFacilities.getFirst());
  }

  private Optional<Facility> findMatchingInspFacility(List<UUID> relatedBaseFacilityIds) {
    return findMatchingInspFacility(relatedBaseFacilityIds, null);
  }

  private Optional<Facility> findMatchingInspFacility(UUID centralFileStateId) {
    List<UUID> relatedBaseFacilityIds;
    try {
      relatedBaseFacilityIds =
          facilityClient.getFacilityFileStateIdsWithSameReferenceFacility(centralFileStateId);
    } catch (NotFound e) {
      LOG.error("No base facility found for ID {}", centralFileStateId, e);
      throw new BadRequestException("No base facility found for ID");
    }

    return findMatchingInspFacility(relatedBaseFacilityIds, centralFileStateId);
  }

  private void validateFacility(AddFacilityFileStateRequest facility) {
    validateFacility(facility, AddFacilityFileStateRequest::contactAddress);
  }

  private void validateFacility(GetReferenceFacilityResponse facility) {
    validateFacility(facility, GetReferenceFacilityResponse::contactAddress);
  }

  private <T> void validateFacility(T facility, Function<T, AddressDto> contactAddressGetter) {
    if (contactAddressGetter.apply(facility) == null) {
      throw new BadRequestException(ErrorCode.BAD_REQUEST, "Contact address is required");
    }
  }

  public InspPendingFacilitiesOverviewResponse getFacilityHistory(UUID externalId) {
    List<PendingFacilityView> candidates =
        findPendingFacilities(
                clock.instant(),
                new PendingFacilitiesInspectionDatabaseFilters(
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    List.of(),
                    List.of(),
                    externalId,
                    null,
                    null,
                    null,
                    null,
                    null),
                null,
                null,
                null,
                null)
            .candidates;

    if (candidates.isEmpty())
      throw new BadRequestException(
          "Could not find inspection matching the current facility ID " + externalId);

    // fetch centralfile data in a bulk query, could be multiple because changes to the facility
    Map<UUID, GetFacilityFileStateResponse> centralFileData =
        fetchCentralFileData(extractCentralFileStateIds(candidates));

    // map to dto
    List<InspPendingFacilityDto> result =
        candidates.stream().map(e -> createInspPendingFacilityDto(e, centralFileData)).toList();

    return new InspPendingFacilitiesOverviewResponse(1, result.size(), result, 0);
  }
}
