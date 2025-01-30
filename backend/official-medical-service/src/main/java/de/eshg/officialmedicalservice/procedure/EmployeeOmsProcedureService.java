/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import static de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory.createSystemProgressEntry;
import static de.eshg.officialmedicalservice.concern.ConcernMapper.mapToConcernDto;
import static de.eshg.officialmedicalservice.concern.ConcernMapper.mapToEntity;
import static java.util.Comparator.comparing;
import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsLast;
import static org.springframework.util.CollectionUtils.isEmpty;

import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.procedures.ProcedureSearchService;
import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentMapper;
import de.eshg.officialmedicalservice.appointment.persistence.entity.AppointmentState;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment_;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.facility.FacilityClient;
import de.eshg.officialmedicalservice.facility.FacilityMapper;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureDetailsDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureHeaderDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureOverviewDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedurePaginationAndSortParameters;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureSortKey;
import de.eshg.officialmedicalservice.procedure.api.EmployeePagedOmsProcedures;
import de.eshg.officialmedicalservice.procedure.api.FacilityDto;
import de.eshg.officialmedicalservice.procedure.api.GetOmsProceduresFilterOptionsDto;
import de.eshg.officialmedicalservice.procedure.api.PatchAffectedPersonRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchConcernRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchEmployeeOmsProcedurePhysicianRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.procedure.api.SyncAffectedPersonRequest;
import de.eshg.officialmedicalservice.procedure.api.SyncFacilityRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Concern;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Concern_;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Facility;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureView;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure_;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import de.eshg.officialmedicalservice.user.UserClient;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.validation.ValidationUtil;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeOmsProcedureService {
  private final OmsProcedureRepository omsProcedureRepository;
  private final OmsProcedureOverviewMapper omsProcedureOverviewMapper;
  private final OmsAppointmentMapper omsAppointmentMapper;
  private final PersonClient personClient;
  private final FacilityClient facilityClient;
  private final UserClient userClient;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final ProgressEntryService progressEntryService;
  private final EntityManager entityManager;
  private final ProcedureSearchService<OmsProcedure> procedureSearchService;

  public EmployeeOmsProcedureService(
      OmsProcedureRepository omsProcedureRepository,
      OmsProcedureOverviewMapper omsProcedureOverviewMapper,
      OmsAppointmentMapper omsAppointmentMapper,
      PersonClient personClient,
      FacilityClient facilityClient,
      Clock clock,
      AuditLogger auditLogger,
      UserClient userClient,
      ProgressEntryService progressEntryService,
      EntityManager entityManager,
      ProcedureSearchService<OmsProcedure> procedureSearchService) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsProcedureOverviewMapper = omsProcedureOverviewMapper;
    this.omsAppointmentMapper = omsAppointmentMapper;
    this.personClient = personClient;
    this.facilityClient = facilityClient;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.userClient = userClient;
    this.progressEntryService = progressEntryService;
    this.entityManager = entityManager;
    this.procedureSearchService = procedureSearchService;
  }

  @Transactional
  public UUID createEmployeeProcedure(PostEmployeeOmsProcedureRequest request) {
    AddPersonFileStateResponse affectedPersonBaseResponse =
        personClient.addPersonFileState(
            PersonMapper.mapToAddPersonFileStateRequest(request.affectedPerson()));

    OmsProcedure procedure =
        omsProcedureOverviewMapper.toDomainType(
            request, CurrentUserHelper.getCurrentUserId(), affectedPersonBaseResponse, null);

    omsProcedureRepository.save(procedure);

    return procedure.getExternalId();
  }

  @Transactional(readOnly = true)
  public EmployeeOmsProcedureHeaderDto getEmployeeProcedureHeader(UUID externalId) {
    OmsProcedureAndAffectedPerson omsProcedureAndAffectedPerson =
        getOmsProcedureAndAffectedPerson(externalId);

    return new EmployeeOmsProcedureHeaderDto(
        omsProcedureAndAffectedPerson.omsProcedure.getExternalId(),
        ProcedureMapper.toInterfaceType(
            omsProcedureAndAffectedPerson.omsProcedure.getProcedureStatus()),
        omsProcedureAndAffectedPerson.affectedPerson.firstName(),
        omsProcedureAndAffectedPerson.affectedPerson.lastName(),
        omsProcedureAndAffectedPerson.affectedPerson.dateOfBirth());
  }

  @Transactional(readOnly = true)
  public EmployeeOmsProcedureDetailsDto getEmployeeProcedureDetails(UUID externalId) {
    OmsProcedureAndAffectedPerson omsProcedureAndAffectedPerson =
        getOmsProcedureAndAffectedPerson(externalId);

    FacilityDto facility = null;
    Optional<Facility> optionalFacility = omsProcedureAndAffectedPerson.omsProcedure.getFacility();
    if (optionalFacility.isPresent()) {
      Facility facilityFromCentralFile = optionalFacility.get();
      GetFacilityFileStateResponse facilityFileState =
          facilityClient.getFacilityFileState(facilityFromCentralFile.getCentralFileStateId());
      facility =
          FacilityMapper.mapToFacilityDto(facilityFileState, facilityFromCentralFile.getVersion());
    }

    UUID physicianId = omsProcedureAndAffectedPerson.omsProcedure.getPhysicianId();
    Optional<UserDto> physician = userClient.retrievePhysician(physicianId);

    return new EmployeeOmsProcedureDetailsDto(
        omsProcedureAndAffectedPerson.omsProcedure.getExternalId(),
        ProcedureMapper.toInterfaceType(
            omsProcedureAndAffectedPerson.omsProcedure.getProcedureStatus()),
        omsProcedureAndAffectedPerson.affectedPerson,
        facility,
        mapToConcernDto(omsProcedureAndAffectedPerson.omsProcedure.getConcern()),
        physician.orElse(null),
        omsAppointmentMapper.toInterfaceType(
            omsProcedureAndAffectedPerson.omsProcedure.getAppointments()));
  }

  @Transactional(readOnly = true)
  public EmployeePagedOmsProcedures getEmployeeProceduresOverview(
      GetOmsProceduresFilterOptionsDto filters,
      EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters,
      ProcedureSearchParameters searchParameters) {

    List<OmsProcedureView> candidates = null;

    if (ProcedureValidator.hasNonNullValue(searchParameters)) {

      List<OmsProcedure> allProcedures =
          procedureSearchService.searchProceduresByPerson(
              searchParameters.searchFirstName(),
              searchParameters.searchLastName(),
              searchParameters.searchDateOfBirth(),
              PersonType.PATIENT);

      candidates = allProcedures.stream().flatMap(this::convertToProcedureViewStream).toList();
    } else {
      Instant isBefore = null;
      Instant isAfter = null;

      if (Boolean.TRUE.equals(filters.today())) {
        LocalDate today = LocalDate.ofInstant(clock.instant(), clock.getZone());
        LocalDateTime startOfDay = today.atStartOfDay();
        isAfter = startOfDay.atZone(clock.getZone()).toInstant();
        isBefore = isAfter.plus(1, ChronoUnit.DAYS);
      }

      UserDto selfUser = userClient.getSelfUser();
      UUID physicianId = Boolean.TRUE.equals(filters.assigned()) ? selfUser.userId() : null;

      candidates =
          findOmsProcedures(
              physicianId, filters.status(), isBefore, isAfter, filters.highPriority());
    }

    List<OmsProcedure> candidateProcedures =
        candidates.stream().map(OmsProcedureView::procedure).toList();

    Map<UUID, GetPersonFileStateResponse> personMap = getPersonMap(candidateProcedures);
    Map<UUID, GetFacilityFileStateResponse> facilityMap = getFacilityMap(candidateProcedures);
    Map<UUID, UserDto> physicianMap = userClient.getPhysiciansMap();
    Map<UUID, Long> idMap = getIdMap(candidateProcedures);

    List<EmployeeOmsProcedureOverviewDto> omsProcedureOverviewDtos =
        chooseNextAppointmentAndMapCandidates(candidates, personMap, facilityMap, physicianMap);

    List<EmployeeOmsProcedureOverviewDto> result =
        sortAndPageEntries(omsProcedureOverviewDtos, paginationAndSortParameters, idMap);

    return new EmployeePagedOmsProcedures(result, omsProcedureOverviewDtos.size());
  }

  private Stream<OmsProcedureView> convertToProcedureViewStream(OmsProcedure procedure) {
    Concern concern = procedure.getConcern();
    List<OmsAppointment> appointments = procedure.getAppointments();

    if (appointments.isEmpty()) {
      return Stream.of(new OmsProcedureView(procedure, procedure.getConcern(), null));
    } else {
      return appointments.stream()
          .map(appointment -> new OmsProcedureView(procedure, concern, appointment));
    }
  }

  private List<OmsProcedureView> findOmsProcedures(
      @Nullable UUID physicianId,
      @Nullable Set<ProcedureStatusDto> status,
      @Nullable Instant isBefore,
      @Nullable Instant isAfter,
      @Nullable Boolean highPriority) {
    Set<ProcedureStatus> procedureStatus =
        Stream.ofNullable(status)
            .flatMap(Collection::stream)
            .map(ProcedureMapper::toDomainType)
            .collect(Collectors.toSet());

    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<OmsProcedureView> cq = cb.createQuery(OmsProcedureView.class);

    // Root from OmsProcedure, LEFT JOIN other OmsProcedure members
    Root<OmsProcedure> procedureRoot = cq.from(OmsProcedure.class);
    Join<OmsProcedure, Concern> concernJoin =
        procedureRoot.join(OmsProcedure_.CONCERN, JoinType.LEFT);
    Join<OmsProcedure, OmsAppointment> appointmentJoin =
        procedureRoot.join(OmsProcedure_.appointments, JoinType.LEFT);

    List<Predicate> predicates = new ArrayList<>();

    if (physicianId != null) {
      predicates.add(
          cb.equal(procedureRoot.get(OmsProcedure_.physicianId), cb.literal(physicianId)));
    }
    if (!isEmpty(procedureStatus)) {
      predicates.add(procedureRoot.get(OmsProcedure_.procedureStatus).in(procedureStatus));
    }

    if (isBefore != null || isAfter != null) {
      predicates.add(
          cb.and(
              cb.isNotNull(appointmentJoin),
              cb.notEqual(
                  appointmentJoin.get(OmsAppointment_.appointmentState),
                  cb.literal(AppointmentState.CLOSED))));

      if (isBefore != null) {
        predicates.add(cb.lessThanOrEqualTo(appointmentJoin.get(OmsAppointment_.start), isBefore));
      }
      if (isAfter != null) {
        predicates.add(
            cb.greaterThanOrEqualTo(appointmentJoin.get(OmsAppointment_.start), isAfter));
      }
    }

    if (Boolean.TRUE.equals(highPriority)) {
      predicates.add(cb.isTrue(concernJoin.get(Concern_.HIGH_PRIORITY)));
    }

    cq.select(cb.construct(OmsProcedureView.class, procedureRoot, concernJoin, appointmentJoin));
    cq.where(cb.and(predicates.toArray(Predicate[]::new)));

    return entityManager.createQuery(cq).getResultList();
  }

  private List<EmployeeOmsProcedureOverviewDto> chooseNextAppointmentAndMapCandidates(
      List<OmsProcedureView> candidates,
      Map<UUID, GetPersonFileStateResponse> personMap,
      Map<UUID, GetFacilityFileStateResponse> facilityMap,
      Map<UUID, UserDto> physicianMap) {
    Instant now = clock.instant();

    Map<Long, Instant> appointmentMap = new HashMap<>();
    for (OmsProcedureView candidate : candidates) {
      Instant appointmentFromMap = appointmentMap.get(candidate.procedure().getId());
      Instant appointmentFromCandidate =
          Optional.ofNullable(candidate.appointment())
              .filter(appointment -> appointment.getAppointmentState() != AppointmentState.CLOSED)
              .map(OmsAppointment::getStart)
              .orElse(null);
      if (appointmentFromCandidate != null
          && (appointmentFromMap == null
              || (appointmentFromCandidate.isBefore(appointmentFromMap)
                  && appointmentFromCandidate.isAfter(now)))) {
        appointmentMap.put(candidate.procedure().getId(), appointmentFromCandidate);
      }
    }

    Set<Long> idsAlreadyInResult = new HashSet<>();

    return candidates.stream()
        .filter(c -> !idsAlreadyInResult.contains(c.procedure().getId()))
        .map(
            c -> {
              idsAlreadyInResult.add(c.procedure().getId());
              return omsProcedureOverviewMapper.toInterfaceType(
                  c.procedure(),
                  getPersonForOmsProcedure(c.procedure(), personMap),
                  getFacilityForOmsProcedure(c.procedure(), facilityMap),
                  getPhysicianForOmsProcedure(c.procedure(), physicianMap),
                  appointmentMap.get(c.procedure().getId()));
            })
        .toList();
  }

  private List<EmployeeOmsProcedureOverviewDto> sortAndPageEntries(
      List<EmployeeOmsProcedureOverviewDto> entries,
      EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters,
      Map<UUID, Long> idMap) {
    return entries.stream()
        .sorted(createComparator(paginationAndSortParameters, idMap))
        .skip(
            (long) paginationAndSortParameters.pageNumberOrFallback(0)
                * (long) paginationAndSortParameters.pageSizeOrFallback(10))
        .limit(paginationAndSortParameters.pageSizeOrFallback(10))
        .toList();
  }

  public static Comparator<EmployeeOmsProcedureOverviewDto> createComparator(
      EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters,
      Map<UUID, Long> idMap) {
    EmployeeOmsProcedureSortKey sortKey =
        Optional.ofNullable(paginationAndSortParameters.sortKey())
            .orElse(EmployeeOmsProcedureSortKey.ID);

    Comparator<EmployeeOmsProcedureOverviewDto> comparator =
        switch (sortKey) {
          case ID ->
              comparing(
                  e -> Optional.ofNullable(e.id()).map(idMap::get).orElse(null),
                  nullsLast(naturalOrder()));
          case FIRSTNAME ->
              comparing(
                  e -> e.firstName() == null ? null : e.firstName(), nullsLast(naturalOrder()));
          case LASTNAME ->
              comparing(e -> e.lastName() == null ? null : e.lastName(), nullsLast(naturalOrder()));
          case DATEOFBIRTH ->
              comparing(
                  e -> e.dateOfBirth() == null ? null : e.dateOfBirth(), nullsLast(naturalOrder()));
          case FACILITYNAME ->
              comparing(
                  e -> e.facilityName() == null ? null : e.facilityName(),
                  nullsLast(naturalOrder()));
          case PHYSICIANNAME ->
              comparing(
                  e -> e.physicianName() == null ? null : e.physicianName(),
                  nullsLast(naturalOrder()));
          case STATUS ->
              comparing(
                  e -> e.status() == null ? null : e.status().name(), nullsLast(naturalOrder()));
          case NEXTAPPOINTMENT ->
              comparing(
                  e -> e.nextAppointment() == null ? null : e.nextAppointment(),
                  nullsLast(naturalOrder()));
          default -> throw new BadRequestException("invalid sort param: " + sortKey);
            // TODO Implement sorting for medical opinion state when the attribute is created
        };
    if (paginationAndSortParameters.sortDirection() == SortDirection.DESC) {
      comparator = comparator.reversed();
    }

    return comparator;
  }

  @Transactional
  public void abortDraftProcedure(UUID externalId) {
    OmsProcedure omsProcedure = loadOmsProcedure(externalId);

    if (omsProcedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException("Procedure is not in DRAFT status");
    }

    omsProcedureRepository.deleteById(omsProcedure.getId());
  }

  @Transactional
  public void acceptDraftProcedure(UUID externalId) {
    OmsProcedure omsProcedure = loadOmsProcedureForUpdate(externalId);

    if (omsProcedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException("Procedure is not in DRAFT status");
    }
    requireFacility(omsProcedure);
    requireConcern(omsProcedure);

    omsProcedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    omsProcedure.addProgressEntry(
        createSystemProgressEntry(
            OmsProgressEntryType.PROCEDURE_STARTED.name(), TriggerType.EMPLOYEE));
  }

  @Transactional
  public void closeOpenProcedure(UUID externalID) {
    OmsProcedure omsProcedure = loadOmsProcedureForUpdate(externalID);

    if (omsProcedure.isFinalized()) {
      throw new BadRequestException("Procedure is already in CLOSED status");
    }
    if (omsProcedure.getProcedureStatus() != ProcedureStatus.OPEN) {
      throw new BadRequestException("Procedure is not in OPEN status");
    }

    // ToDo require all appointments closed

    omsProcedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
  }

  @Transactional
  public void updateAffectedPerson(
      UUID externalId, PatchAffectedPersonRequest patchAffectedPersonRequest) {
    OmsProcedure omsProcedure = loadOmsProcedureForUpdate(externalId);

    if (omsProcedure.isFinalized()) {
      throw new BadRequestException("Affected person can not be edited in CLOSED status");
    }

    Person person = omsProcedure.findAffectedPerson();

    ValidationUtil.validateVersion(patchAffectedPersonRequest.affectedPerson().version(), person);
    UUID previousFileStateId = person.getCentralFileStateId();

    AddPersonFileStateResponse baseResponse;
    try {
      baseResponse =
          personClient.updatePersonFileStateAndReference(
              previousFileStateId,
              PersonMapper.mapToUpdatePersonRequest(patchAffectedPersonRequest.affectedPerson()));
    } catch (BadRequestException e) {
      if (!"Matching reference Person already exists".equals(e.getMessage())) {
        throw e;
      }
      baseResponse =
          personClient.addPersonFileState(
              PersonMapper.mapToAddPersonFileStateRequest(
                  patchAffectedPersonRequest.affectedPerson()));
    }

    person.setCentralFileStateId(baseResponse.id());

    progressEntryService.createProgressEntryForUpdateAffectedPerson(
        omsProcedure, previousFileStateId);
  }

  @Transactional
  public void syncAffectedPerson(UUID externalId, SyncAffectedPersonRequest request) {
    OmsProcedure procedure = loadOmsProcedureForUpdate(externalId);

    if (procedure.isFinalized()) {
      throw new BadRequestException("Affected person can not be synced in CLOSED status");
    }

    Person person = procedure.getRelatedPersons().getFirst();
    UUID currentFileStateId = person.getCentralFileStateId();
    UUID updateFileStateId =
        personClient.syncAffectedPerson(currentFileStateId, request.referenceVersion());
    person.setCentralFileStateId(updateFileStateId);

    progressEntryService.createProgressEntryForSyncAffectedPerson(procedure, currentFileStateId);
  }

  @Transactional
  public UUID addFacility(UUID externalId, PostEmployeeOmsProcedureFacilityRequest request) {
    OmsProcedure procedure = loadOmsProcedure(externalId);

    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException("Facility can only be added in DRAFT status");
    }
    if (procedure.getFacility().isPresent()) {
      throw new BadRequestException("Procedure already has a facility");
    }
    AddFacilityFileStateResponse facilityFileState =
        facilityClient.addFacilityFileState(
            FacilityMapper.mapToAddFacilityFileStateRequest(request.facility()));

    Facility facility = new Facility();
    facility.setCentralFileStateId(facilityFileState.id());
    facility.setFacilityType(FacilityType.OTHER);
    procedure.addRelatedFacility(facility);

    return facilityFileState.id();
  }

  @Transactional
  public void updateFacility(UUID externalId, PatchEmployeeOmsProcedureFacilityRequest request) {
    OmsProcedure procedure = loadOmsProcedureForUpdate(externalId);

    if (procedure.isFinalized()) {
      throw new BadRequestException("Facility can not be edited in CLOSED status");
    }
    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException("Facility can only be synced in DRAFT status");
    }

    Optional<Facility> optionalFacility = procedure.getFacility();
    if (optionalFacility.isEmpty()) {
      throw new BadRequestException("Procedure doesn't have a facility");
    }
    Facility facility = optionalFacility.get();
    ValidationUtil.validateVersion(request.updatedFacility().version(), facility);

    AddFacilityFileStateResponse baseResponse;
    try {
      baseResponse =
          facilityClient.updateFacilityFileStateAndReference(
              facility.getCentralFileStateId(),
              FacilityMapper.mapToPutFacilityRequest(request.updatedFacility()));
    } catch (BadRequestException e) {
      if (!"Matching reference facility already exists".equals(e.getMessage())) {
        throw e;
      }
      baseResponse =
          facilityClient.addFacilityFileState(
              FacilityMapper.mapToAddFacilityFileStateRequest(request.updatedFacility()));
    }

    facility.setCentralFileStateId(baseResponse.id());
  }

  @Transactional
  public void syncFacilityData(UUID externalId, SyncFacilityRequest request) {
    OmsProcedure procedure = loadOmsProcedureForUpdate(externalId);

    if (procedure.isFinalized()) {
      throw new BadRequestException("Facility can not be synced in CLOSED status");
    }
    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException("Facility can only be synced in DRAFT status");
    }

    Optional<Facility> optionalFacility = procedure.getFacility();
    if (optionalFacility.isEmpty()) {
      throw new BadRequestException("Procedure doesn't have a facility");
    }
    Facility facility = optionalFacility.get();

    UUID updatedFileStateId =
        facilityClient.syncFacility(facility.getCentralFileStateId(), request.referenceVersion());
    facility.setCentralFileStateId(updatedFileStateId);

    progressEntryService.createProgressEntryForSyncFacility(procedure);
  }

  @Transactional
  public UUID modifyPhysician(UUID externalId, PatchEmployeeOmsProcedurePhysicianRequest request) {
    OmsProcedure procedure = loadOmsProcedure(externalId);

    if (procedure.isFinalized()) {
      throw new BadRequestException("A physician can not be set in CLOSED status");
    }

    UUID newPhysicianId = request.physicianId();
    UserDto newPhysician =
        userClient.validateUser(newPhysicianId, userClient.getTechnicalGroupPhysicians());

    procedure.setPhysicianId(newPhysicianId);
    progressEntryService.createProgressEntryForModifiedPhysician(procedure, newPhysician);
    return newPhysicianId;
  }

  @Transactional
  public void updateOmsProcedureConcern(UUID externalId, PatchConcernRequest request) {
    OmsProcedure omsProcedure = loadOmsProcedureForUpdate(externalId);

    if (omsProcedure.isFinalized()) {
      throw new BadRequestException("Concern can not be edited in CLOSED status");
    }
    if (omsProcedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException("Procedure is not in DRAFT status");
    }

    Concern existingConcern = omsProcedure.getConcern();

    if (existingConcern != null) {
      ValidationUtil.validateVersion(request.concern().version(), existingConcern);
      ConcernMapper.mapOntoExistingEntity(request.concern(), existingConcern);
    } else {
      omsProcedure.setConcern(mapToEntity(request.concern()));
    }
  }

  private OmsProcedure loadOmsProcedure(UUID externalId) {
    return omsProcedureRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  private OmsProcedure loadOmsProcedureForUpdate(UUID externalId) {
    return omsProcedureRepository
        .findByExternalIdForUpdate(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  private OmsProcedureAndAffectedPerson getOmsProcedureAndAffectedPerson(UUID externalId) {
    OmsProcedure omsProcedure = loadOmsProcedure(externalId);
    Person person = omsProcedure.findAffectedPerson();

    GetPersonFileStateResponse personFileStateResponse =
        personClient.getPersonFileState(person.getCentralFileStateId());

    AffectedPersonDto affectedPerson =
        PersonMapper.mapToAffectedPersonDto(personFileStateResponse, person.getVersion());

    return new OmsProcedureAndAffectedPerson(omsProcedure, affectedPerson);
  }

  private Map<UUID, GetPersonFileStateResponse> getPersonMap(List<OmsProcedure> omsProcedures) {
    List<UUID> centralFileStateIds =
        omsProcedures.stream()
            .map(OmsProcedure::findAffectedPerson)
            .map(RelatedPerson::getCentralFileStateId)
            .distinct()
            .toList();

    if (centralFileStateIds.isEmpty()) {
      return Collections.emptyMap();
    }

    GetPersonFileStatesResponse personFileStatesResponse =
        personClient.getPersonFileStates(
            new GetPersonFileStatesRequest(
                omsProcedures.stream()
                    .map(OmsProcedure::findAffectedPerson)
                    .filter(Objects::nonNull)
                    .map(RelatedPerson::getCentralFileStateId)
                    .distinct()
                    .toList()));

    return personFileStatesResponse.personFileStates().stream()
        .collect(Collectors.toMap(GetPersonFileStateResponse::id, person -> person));
  }

  private Map<UUID, GetFacilityFileStateResponse> getFacilityMap(List<OmsProcedure> omsProcedures) {
    List<UUID> centralFileStateIds =
        omsProcedures.stream()
            .map(OmsProcedure::getFacility)
            .flatMap(Optional::stream)
            .map(Facility::getCentralFileStateId)
            .distinct()
            .toList();

    if (centralFileStateIds.isEmpty()) {
      return Collections.emptyMap();
    }

    GetFacilityFileStatesResponse facilityFileStatesResponse =
        facilityClient.getFacilityFileStates(new GetFacilityFileStatesRequest(centralFileStateIds));

    return facilityFileStatesResponse.facilityFileStates().stream()
        .collect(Collectors.toMap(GetFacilityFileStateResponse::id, facility -> facility));
  }

  private Map<UUID, Long> getIdMap(List<OmsProcedure> omsProcedures) {
    Map<UUID, Long> map = new HashMap<>();
    for (OmsProcedure omsProcedure : omsProcedures) {
      map.put(omsProcedure.getExternalId(), omsProcedure.getId());
    }
    return map;
  }

  private GetPersonFileStateResponse getPersonForOmsProcedure(
      OmsProcedure omsProcedure, Map<UUID, GetPersonFileStateResponse> personMap) {
    if (omsProcedure.findAffectedPerson() == null) {
      return null;
    }
    return personMap.get(omsProcedure.findAffectedPerson().getCentralFileStateId());
  }

  private GetFacilityFileStateResponse getFacilityForOmsProcedure(
      OmsProcedure omsProcedure, Map<UUID, GetFacilityFileStateResponse> facilityMap) {
    return omsProcedure
        .getFacility()
        .map(facility -> facilityMap.get(facility.getCentralFileStateId()))
        .orElse(null);
  }

  private void requireFacility(OmsProcedure omsProcedure) {
    if (omsProcedure.getFacility().isEmpty()) {
      throw new BadRequestException("Procedure is missing a facility");
    }
  }

  private void requireConcern(OmsProcedure omsProcedure) {
    if (omsProcedure.getConcern() == null) {
      throw new BadRequestException("Procedure is missing a concern");
    }
  }

  private UserDto getPhysicianForOmsProcedure(
      OmsProcedure omsProcedure, Map<UUID, UserDto> physicianMap) {
    return Optional.ofNullable(omsProcedure.getPhysicianId()).map(physicianMap::get).orElse(null);
  }

  private record OmsProcedureAndAffectedPerson(
      OmsProcedure omsProcedure, AffectedPersonDto affectedPerson) {}
}
