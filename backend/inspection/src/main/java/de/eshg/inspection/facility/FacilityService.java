/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import static java.util.stream.Collectors.toUnmodifiableMap;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.springframework.util.CollectionUtils.isEmpty;

import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.*;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.domain.model.SequencedBaseEntity_;
import de.eshg.inspection.facility.api.GetPendingFacilitiesFilterOptionsDto;
import de.eshg.inspection.facility.api.GetPendingFacilitiesPaginationOptionsDto;
import de.eshg.inspection.facility.api.InspAddFacilityRequest;
import de.eshg.inspection.facility.api.InspAddFacilityResponse;
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
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.inspection.InspectionFinalizer;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionResult;
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
import de.eshg.lib.foureyes.spring.FourEyesPrincipleAutoConfiguration;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException.NotFound;

@Service
public class FacilityService {
  private static final Logger log = LoggerFactory.getLogger(FacilityService.class);

  private static final long KIND_PENDING_RANGE_IN_DAYS = 14;

  private final FacilityRepository facilityRepository;
  private final FacilityClient facilityClient;
  private final InspectionService inspectionService;
  private final WebSearchService webSearchService;
  private final Clock clock;
  private final EntityManager entityManager;
  private final InspectionFinalizer inspectionFinalizer;
  private final InspectionRepository inspectionRepository;
  private final InspectionFeatureToggle inspectionFeatureToggle;
  private final FourEyesPrincipleAutoConfiguration fourEyesPrincipleAutoConfiguration;

  public FacilityService(
      FacilityRepository facilityRepository,
      FacilityClient facilityClient,
      InspectionService inspectionService,
      WebSearchService webSearchService,
      Clock clock,
      EntityManager entityManager,
      InspectionFinalizer inspectionFinalizer,
      InspectionRepository inspectionRepository,
      InspectionFeatureToggle inspectionFeatureToggle,
      FourEyesPrincipleAutoConfiguration fourEyesPrincipleAutoConfiguration) {
    this.facilityRepository = facilityRepository;
    this.facilityClient = facilityClient;
    this.inspectionService = inspectionService;
    this.webSearchService = webSearchService;
    this.clock = clock;
    this.entityManager = entityManager;
    this.inspectionFinalizer = inspectionFinalizer;
    this.inspectionRepository = inspectionRepository;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    this.fourEyesPrincipleAutoConfiguration = fourEyesPrincipleAutoConfiguration;
  }

  public InspAddFacilityResponse addFacility(InspAddFacilityRequest request) {
    validateFacility(request.baseFacility());

    // call base module to save facility in centralfile
    // Ideally we would like to not create a new facility file state unconditionally here, because
    // we don't need it if we have an existing inspection, but with the current base API it's not
    // feasible to do it in a different way.
    AddFacilityFileStateResponse baseResponse =
        facilityClient.addFacilityFileState(request.baseFacility());

    Optional<Facility> matchedInspFacility = findMatchingInspFacility(baseResponse.id());

    // save in db
    Facility facility = FacilityMapper.facilityFrom(baseResponse);

    // If the inspection facility already exists, we don't want to create it again.
    Facility savedFacility = matchedInspFacility.orElseGet(() -> facilityRepository.save(facility));

    InspFacilityDto facilityDTO =
        FacilityMapper.fromAddFacilityResponse(savedFacility, baseResponse);

    Inspection inspection;
    boolean isNew = false;

    if (matchedInspFacility.isEmpty()) {
      log.info("addFacility: saved new facility {}", savedFacility.getId());

      // create draft inspection
      isNew = true;
      inspection = inspectionService.createDraftInspection(savedFacility);
    } else {
      log.info("addFacility: matched existing facility {}", savedFacility.getId());

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
      log.info("linkBaseFacility: saved new inspection facility {}", savedFacility.getId());
      isNew = true;
      newestInspection = inspectionService.createDraftInspection(savedFacility);
    } else {
      Facility inspFacility = matchedInspFacility.get();
      centralFileStateId = inspFacility.getCentralFileStateId();
      newestInspection = inspectionService.findNewestOpenInspectionForFacility(inspFacility);
      if (newestInspection == null) {
        isNew = true;
        newestInspection =
            inspectionFinalizer.createFollowupInspection(
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

  public InspFacilityDto updateFacility(UUID externalId, InspUpdateFacilityRequest request) {
    validateFacility(request.baseFacility());

    Inspection inspection = inspectionService.loadInspectionForUpdate(request.procedureId());
    Facility facility = loadFacility(externalId);

    // call base module to save facility state in central file
    AddFacilityFileStateResponse baseResponse;
    try {
      baseResponse =
          facilityClient.updateFacilityFileStateAndReference(
              facility.getCentralFileStateId(),
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

    // save in db with new central file state
    Facility savedFacility =
        facilityRepository.save(FacilityMapper.mapFacility(facility, baseResponse, request));
    log.info("updated facility {}", savedFacility.getId());

    inspection.getRelatedFacility().setCentralFileStateId(baseResponse.id());
    log.info("updated inspection {}", inspection.getId());

    return FacilityMapper.fromAddFacilityResponse(savedFacility, baseResponse);
  }

  public InspPendingFacilitiesOverviewResponse getPendingFacilities(
      GetPendingFacilitiesFilterOptionsDto params,
      GetPendingFacilitiesPaginationOptionsDto pagination) {
    if (params.hasDuplicates() != null) {
      inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.IMPORT);
    }
    if (params.banned() != null) {
      inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.BANNED_FACILITIES_EXPORT);
    }

    // early validate page request params
    PageRequest pageRequest = pagination.getPageRequest();

    List<Long> facilityIdsWithFacilityDuplicate = facilityRepository.getFacilityIdsWithDuplicates();

    List<Long> inspectionIdsWithInspectionDuplicate =
        inspectionRepository.getInspectionIdsWithDuplicates();

    long numberOfDuplicates =
        (long) facilityIdsWithFacilityDuplicate.size()
            + (long) inspectionIdsWithInspectionDuplicate.size();

    List<PendingFacilityView> candidates =
        findPendingFacilities(
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
            null);

    // fetch centralfile data in a bulk query
    Map<UUID, AddFacilityFileStateResponse> centralFileData =
        fetchCentralFileData(extractCentralFileStateIds(candidates));

    // map to dto
    Stream<InspPendingFacilityDto> entries =
        candidates.stream().map(e -> createInspPendingFacilityDto(e, centralFileData));

    // application-side filtering and sorting (cannot do this in db because of db separation)
    List<InspPendingFacilityDto> filteredEntries = filterEntries(entries, params);
    List<InspPendingFacilityDto> result = sortAndPageEntries(filteredEntries, pageRequest);

    int totalPages = (int) Math.ceil((double) filteredEntries.size() / pageRequest.getPageSize());

    return new InspPendingFacilitiesOverviewResponse(
        totalPages, filteredEntries.size(), result, numberOfDuplicates);
  }

  private List<PendingFacilityView> findPendingFacilities(
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
      @Nullable UUID facilityExternalId) {
    Set<ProcedureStatus> procedureStatus = FacilityMapper.toDomainType(status);

    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<PendingFacilityView> cq = cb.createQuery(PendingFacilityView.class);

    // Root from Inspection, LEFT JOIN other Inspection members
    Root<Inspection> inspectionRoot = cq.from(Inspection.class);
    Join<Inspection, InspectionRelatedFacility> irfJoin =
        inspectionRoot.join(Inspection_.RELATED_FACILITIES, JoinType.LEFT);
    Join<InspectionRelatedFacility, Facility> facilityJoin =
        irfJoin.join(InspectionRelatedFacility_.facility, JoinType.LEFT);
    Join<Inspection, InspectionAppointment> executionAppointmentJoin =
        inspectionRoot.join(Inspection_.executionAppointment, JoinType.LEFT);
    Join<Inspection, InspectionAppointment> plannedAppointmentJoin =
        inspectionRoot.join(Inspection_.plannedAppointment, JoinType.LEFT);

    List<Predicate> predicates = new ArrayList<>();

    // Create Predicates
    if (objectTypeId != null) {
      predicates.add(
          cb.equal(facilityJoin.get(Facility_.objectType).get(ObjectType_.id), objectTypeId));
    }
    if (!isEmpty(procedureStatus)) {
      predicates.add(inspectionRoot.get(Inspection_.procedureStatus).in(procedureStatus));
    }
    if (!isEmpty(type)) {
      predicates.add(inspectionRoot.get(Inspection_.type).in(type));
    }
    if (!isEmpty(phase)) {
      predicates.add(inspectionRoot.get(Inspection_.phase).in(phase));
    }
    if (isBefore != null) {
      predicates.add(
          cb.or(
              cb.and(
                  cb.isNotNull(executionAppointmentJoin),
                  cb.lessThanOrEqualTo(
                      executionAppointmentJoin.get(InspectionAppointment_.appointmentStart),
                      isBefore)),
              cb.and(
                  cb.isNull(executionAppointmentJoin),
                  cb.isNotNull(plannedAppointmentJoin),
                  cb.lessThanOrEqualTo(
                      plannedAppointmentJoin.get(InspectionAppointment_.appointmentStart),
                      isBefore)),
              cb.and(
                  cb.isNull(executionAppointmentJoin),
                  cb.isNull(plannedAppointmentJoin),
                  cb.lessThanOrEqualTo(
                      cb.literal(LocalDate.ofInstant(clock.instant(), ZoneOffset.UTC)),
                      LocalDate.ofInstant(isBefore, ZoneOffset.UTC)))));
    }
    if (isAfter != null) {
      predicates.add(
          cb.or(
              cb.and(
                  cb.isNotNull(executionAppointmentJoin),
                  cb.greaterThanOrEqualTo(
                      executionAppointmentJoin.get(InspectionAppointment_.appointmentEnd),
                      isAfter)),
              cb.and(
                  cb.isNull(executionAppointmentJoin),
                  cb.isNotNull(plannedAppointmentJoin),
                  cb.greaterThanOrEqualTo(
                      plannedAppointmentJoin.get(InspectionAppointment_.appointmentEnd), isAfter)),
              cb.and(
                  cb.isNull(executionAppointmentJoin),
                  cb.isNull(plannedAppointmentJoin),
                  cb.greaterThanOrEqualTo(
                      cb.literal(LocalDate.ofInstant(clock.instant(), ZoneOffset.UTC)),
                      LocalDate.ofInstant(isAfter, ZoneOffset.UTC)))));
    }
    if (facilityExternalId != null) {
      predicates.add(facilityJoin.get(Facility_.externalId).in(facilityExternalId));
    }

    if (hasDuplicates != null) {
      Predicate hasDuplicatesPredicate =
          cb.or(
              inspectionRoot.get(SequencedBaseEntity_.id).in(inspectionIds),
              facilityJoin.get(BaseEntity_.id).in(facilityIdsWithFacilityDuplicate));

      predicates.add(hasDuplicates ? hasDuplicatesPredicate : cb.not(hasDuplicatesPredicate));
    }

    if (banned != null) {
      predicates.add(cb.equal(facilityJoin.get(Facility_.BANNED), cb.literal(banned)));
    }

    cq.select(cb.construct(PendingFacilityView.class, facilityJoin, irfJoin, inspectionRoot));
    cq.where(cb.and(predicates.toArray(Predicate[]::new)));

    return entityManager.createQuery(cq).getResultList();
  }

  private Facility loadFacility(UUID externalId) {
    return facilityRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Facility not found"));
  }

  public Map<UUID, AddFacilityFileStateResponse> fetchCentralFileData(
      List<UUID> centralFileStateIds) {
    if (centralFileStateIds.isEmpty()) return Map.of();
    return facilityClient.getFacilityFileStates(centralFileStateIds).stream()
        .collect(toUnmodifiableMap(AddFacilityFileStateResponse::id, facility -> facility));
  }

  private static List<UUID> extractCentralFileStateIds(List<PendingFacilityView> list) {
    return list.stream()
        .flatMap(
            e ->
                Stream.of(
                    e.facility().getCentralFileStateId(),
                    e.irf() != null ? e.irf().getCentralFileStateId() : null))
        .filter(Objects::nonNull)
        .distinct()
        .toList();
  }

  private InspPendingFacilityDto createInspPendingFacilityDto(
      PendingFacilityView view, Map<UUID, AddFacilityFileStateResponse> centralFileData) {
    Instant now = clock.instant();
    InspectionAppointment plannedAppointment = getPlannedAppointment(view);

    Instant plannedFrom =
        plannedAppointment == null ? null : plannedAppointment.getAppointmentStart();

    InspPendingFacilityKind kind = determineInspPendingFacilityKind(view, plannedFrom, now);

    UUID centralFileStateId =
        view.irf() != null
            ? view.irf().getCentralFileStateId()
            : view.facility().getCentralFileStateId();
    AddFacilityFileStateResponse facilityDto = centralFileData.get(centralFileStateId);
    ObjectType objectType = view.facility().getObjectType();
    ObjectTypeRefDto objecttype =
        objectType != null ? new ObjectTypeRefDto(objectType.getId(), objectType.getName()) : null;
    InspectionAppointment executionAppointment = getExecutionAppointment(view);
    Instant executionFrom =
        executionAppointment == null ? null : executionAppointment.getAppointmentStart();

    return FacilityMapper.createInspPendingFacilityDto(
        view, facilityDto, kind, plannedFrom, objecttype, executionFrom);
  }

  private InspPendingFacilityKind determineInspPendingFacilityKind(
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

  private static InspectionResult getInspectionResult(PendingFacilityView view) {
    return view.inspection() != null && view.inspection().getResult() != null
        ? view.inspection().getResult()
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
        log.error(
            "Could not link facility {} to web search entry {}",
            centralFileStateId,
            webSearchEntryId,
            e);
        throw new BadRequestException("Could not link facility to web wearch entry");
      }
    }
  }

  private List<InspPendingFacilityDto> filterEntries(
      Stream<InspPendingFacilityDto> entries, GetPendingFacilitiesFilterOptionsDto params) {
    return entries
        .filter(e -> ilike(e.name(), params.name()))
        .filter(e -> ilike(e.postalCode(), params.postalCode()))
        .filter(e -> ilike(e.city(), params.city()))
        .filter(e -> ilike(e.street(), params.street()))
        .filter(e -> params.kind() == null || params.kind().contains(e.kind()))
        .toList();
  }

  private List<InspPendingFacilityDto> sortAndPageEntries(
      List<InspPendingFacilityDto> entries, PageRequest pageRequest) {
    return entries.stream()
        .sorted(GetPendingFacilitiesPaginationOptionsDto.createComparator(pageRequest))
        .skip((long) pageRequest.getPageNumber() * (long) pageRequest.getPageSize())
        .limit(pageRequest.getPageSize())
        .toList();
  }

  private static boolean ilike(String s, String filter) {
    return isBlank(filter) || containsIgnoreCase(s, filter);
  }

  private Optional<Facility> findMatchingInspFacility(
      List<UUID> relatedBaseFacilityIds, UUID centralFileStateId) {
    List<Facility> matchedInspFacilities =
        facilityRepository.findAllByCentralFileStateIdIn(relatedBaseFacilityIds);

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
      log.error("No base facility found for ID {}", centralFileStateId, e);
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
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.FACILITY_HISTORY);

    List<PendingFacilityView> candidates =
        findPendingFacilities(
            null, null, null, null, null, null, null, null, List.of(), List.of(), externalId);

    if (candidates.isEmpty())
      throw new BadRequestException(
          "Could not find inspection matching the current facility ID " + externalId);

    // fetch centralfile data in a bulk query, could be multiple because changes to the facility
    Map<UUID, AddFacilityFileStateResponse> centralFileData =
        fetchCentralFileData(extractCentralFileStateIds(candidates));

    // map to dto
    List<InspPendingFacilityDto> result =
        candidates.stream().map(e -> createInspPendingFacilityDto(e, centralFileData)).toList();

    return new InspPendingFacilitiesOverviewResponse(1, result.size(), result, 0);
  }
}
