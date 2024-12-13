/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.CASE_STATUS_CHANGED;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.appointmentblock.AppointmentMapper;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.measlesprotection.api.CaseStatusDto;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresFilterOptions;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresPaginationOptions;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresSortOptions;
import de.eshg.measlesprotection.api.MPFacilityTypeDto;
import de.eshg.measlesprotection.api.UpdateProcedureRequest;
import de.eshg.measlesprotection.mapper.AccessRestrictionMapper;
import de.eshg.measlesprotection.mapper.CaseStatusMapper;
import de.eshg.measlesprotection.mapper.MPFacilityTypeMapper;
import de.eshg.measlesprotection.mapper.MonetaryFineMapper;
import de.eshg.measlesprotection.mapper.ProofSubmissionMapper;
import de.eshg.measlesprotection.mapper.ReportDataMapper;
import de.eshg.measlesprotection.mapper.RoleStatusMapper;
import de.eshg.measlesprotection.mapper.SubmissionResultMapper;
import de.eshg.measlesprotection.persistence.centralfile.FacilityClient;
import de.eshg.measlesprotection.persistence.centralfile.FacilityData;
import de.eshg.measlesprotection.persistence.centralfile.PersonClient;
import de.eshg.measlesprotection.persistence.centralfile.PersonFileStateIdsWithSameReferencePerson;
import de.eshg.measlesprotection.persistence.centralfile.ProcedureDetailsData;
import de.eshg.measlesprotection.persistence.centralfile.ProcedureWithPersonDetailsData;
import de.eshg.measlesprotection.persistence.db.CaseStatus;
import de.eshg.measlesprotection.persistence.db.Facility;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedureRepository;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure_;
import de.eshg.measlesprotection.persistence.db.Person;
import de.eshg.measlesprotection.persistence.db.PersonRepository;
import de.eshg.measlesprotection.persistence.db.Person_;
import de.eshg.measlesprotection.persistence.db.ReportData;
import de.eshg.measlesprotection.persistence.db.RoleStatus;
import de.eshg.measlesprotection.persistence.support.MeaslesProtectionProcedureSpecification;
import de.eshg.measlesprotection.persistence.support.ResultPage;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
public class MeaslesProtectionService {

  public static final String NOT_APPLICABLE = "k.A.";

  private final PersonClient personClient;
  private final FacilityClient facilityClient;
  private final MeaslesProtectionProcedureRepository measlesProtectionProcedureRepository;
  private final PersonRepository personRepository;
  private final ProcedureFinder procedureFinder;
  private final ProcedureDeletionService<MeaslesProtectionProcedure> procedureDeletionService;
  private final Clock clock;

  public MeaslesProtectionService(
      PersonClient personClient,
      FacilityClient facilityClient,
      MeaslesProtectionProcedureRepository measlesProtectionProcedureRepository,
      PersonRepository personRepository,
      ProcedureFinder procedureFinder,
      ProcedureDeletionService<MeaslesProtectionProcedure> procedureDeletionService,
      Clock clock) {
    this.personClient = personClient;
    this.facilityClient = facilityClient;
    this.measlesProtectionProcedureRepository = measlesProtectionProcedureRepository;
    this.personRepository = personRepository;
    this.procedureFinder = procedureFinder;
    this.procedureDeletionService = procedureDeletionService;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  public ProcedureDetailsData findAndAugmentProcedureByExternalId(UUID procedureId) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);
    return augmentProcedure(procedure);
  }

  private ProcedureDetailsData augmentProcedure(MeaslesProtectionProcedure procedure) {
    Map<UUID, AddFacilityFileStateResponse> facilitiesById =
        facilityClient.fetchAllRelatedFacilities(List.of(procedure));
    ProcedureWithPersonDetailsData personDetails = personClient.augmentWithPersonDetails(procedure);
    return augmentWithFacilityDetails(personDetails, facilitiesById);
  }

  @Transactional(readOnly = true)
  public ResultPage<ProcedureDetailsData> getProcedures(
      GetMeaslesProtectionProceduresPaginationOptions paginationOptions,
      GetMeaslesProtectionProceduresSortOptions sortOptions,
      GetMeaslesProtectionProceduresFilterOptions filterOptions) {

    PageRequest pageable =
        PageRequest.of(
            paginationOptions.pageNumber(),
            paginationOptions.pageSize(),
            getSortDirection(sortOptions),
            getSortProperty(sortOptions));

    MeaslesProtectionProcedureSpecification specification =
        new MeaslesProtectionProcedureSpecification(
            getCreationDateAsInstant(filterOptions.creationDate()),
            mapEnumSet(filterOptions.facilityType(), MPFacilityTypeMapper::toDomainType),
            mapEnumSet(filterOptions.caseStatus(), CaseStatusMapper::toDatabaseType),
            mapEnumSet(filterOptions.procedureStatus(), ProcedureMapper::toDomainType),
            mapEnumSet(filterOptions.roleStatus(), RoleStatusMapper::toDatabaseType),
            filterOptions.hasAppointment(),
            filterOptions.measure(),
            filterOptions.proofRequestSent(),
            mapEnumSet(
                filterOptions.proofSubmissionResult(), SubmissionResultMapper::toDatabaseType));

    Page<MeaslesProtectionProcedure> procedures =
        measlesProtectionProcedureRepository.findAll(specification, pageable);
    if (procedures.isEmpty()) {
      return new ResultPage<>(0, 0, List.of());
    }

    List<MeaslesProtectionProcedure> allProcedures = procedures.toList();
    Map<UUID, AddFacilityFileStateResponse> facilitiesById =
        facilityClient.fetchAllRelatedFacilities(allProcedures);

    List<ProcedureDetailsData> detailsData =
        personClient
            .augmentWithPersonDetails(allProcedures)
            .map(personDetails -> augmentWithFacilityDetails(personDetails, facilitiesById))
            .filter(byFilterOptions(filterOptions))
            .sorted(byComparatorOf(sortOptions))
            .toList();
    return new ResultPage<>(procedures.getTotalPages(), procedures.getTotalElements(), detailsData);
  }

  private static String getSortProperty(GetMeaslesProtectionProceduresSortOptions sortOptions) {
    return switch (sortOptions.sortBy()) {
      case CREATED_AT -> Procedure_.CREATED_AT;
      case CASE_STATUS -> MeaslesProtectionProcedure_.CASE_STATUS;
      case PROCEDURE_STATUS -> Procedure_.PROCEDURE_STATUS;
      default -> BaseEntity_.ID;
    };
  }

  private static Direction getSortDirection(GetMeaslesProtectionProceduresSortOptions sortOptions) {
    return switch (sortOptions.sortOrder()) {
      case ASC -> Direction.ASC;
      case DESC -> Direction.DESC;
    };
  }

  private Instant getCreationDateAsInstant(LocalDate creationDate) {
    if (creationDate == null) {
      return null;
    }
    return creationDate.atStartOfDay(clock.getZone()).toInstant();
  }

  private static Predicate<ProcedureDetailsData> byFilterOptions(
      GetMeaslesProtectionProceduresFilterOptions filterOptions) {
    return filterByAffectedPersonBirthday(filterOptions.birthday());
  }

  private static Predicate<ProcedureDetailsData> filterByAffectedPersonBirthday(
      LocalDate birthday) {
    if (birthday == null) {
      return procedureDetailsData -> true;
    }
    return procedureData -> procedureData.person().dateOfBirth().isEqual(birthday);
  }

  private static Comparator<ProcedureDetailsData> byComparatorOf(
      GetMeaslesProtectionProceduresSortOptions sortOptions) {
    Comparator<ProcedureDetailsData> comparator =
        switch (sortOptions.sortBy()) {
          case FIRST_NAME -> Comparator.comparing(o -> o.person().firstName());
          case LAST_NAME -> Comparator.comparing(o -> o.person().lastName());
          case DATE_OF_BIRTH -> Comparator.comparing(o -> o.person().dateOfBirth());
          case FACILITY_NAME -> Comparator.comparing(byFacilityName());
          case FACILITY_TYPE -> Comparator.comparing(byFacilityType());
          default -> Comparator.comparing(o -> 0);
        };

    return switch (sortOptions.sortOrder()) {
      case ASC -> comparator;
      case DESC -> comparator.reversed();
    };
  }

  private static Function<ProcedureDetailsData, String> byFacilityType() {
    return o -> {
      FacilityData facilityData = o.facilityData();
      if (facilityData == null) {
        return NOT_APPLICABLE;
      }
      MPFacilityTypeDto facilityTypeDto = facilityData.facilityType();
      if (facilityTypeDto == null) {
        return NOT_APPLICABLE;
      }
      return facilityTypeDto.name();
    };
  }

  private static Function<ProcedureDetailsData, String> byFacilityName() {
    return o -> {
      FacilityData facilityData = o.facilityData();
      if (facilityData == null) {
        return NOT_APPLICABLE;
      }
      AddFacilityFileStateResponse facilityDto = facilityData.facilityDto();
      if (facilityDto == null) {
        return NOT_APPLICABLE;
      }
      return facilityDto.name();
    };
  }

  private static ProcedureDetailsData augmentWithFacilityDetails(
      ProcedureWithPersonDetailsData personDetails,
      Map<UUID, AddFacilityFileStateResponse> facilitiesById) {
    MeaslesProtectionProcedure procedure = personDetails.procedure();
    Optional<UUID> centralFileFacilityId = procedure.getFacilityIdFromCentralFile();

    Person patient =
        procedure.getRelatedPersons().stream()
            .filter(Person::isPatient)
            .collect(StreamUtil.toSingleElement());

    FacilityData facilityData = getFacilityData(facilitiesById, procedure, centralFileFacilityId);
    return new ProcedureDetailsData(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        procedure.getProcedureStatus(),
        patient.getRoleStatus(),
        personDetails.personDetails(),
        personDetails.custodianDetails(),
        facilityData,
        ProofSubmissionMapper.toInterfaceType(procedure.getProofSubmissions()),
        ReportDataMapper.toInterfaceType(procedure.getReportData()),
        MonetaryFineMapper.toInterfaceType(procedure.getMonetaryFines()),
        AccessRestrictionMapper.toInterfaceType(procedure.getAccessRestriction()),
        CaseStatusMapper.toInterfaceType(procedure.getCaseStatus()),
        AppointmentMapper.mapAppointmentToDto(procedure.getAppointment()),
        procedure);
  }

  private static FacilityData getFacilityData(
      Map<UUID, AddFacilityFileStateResponse> facilitiesById,
      MeaslesProtectionProcedure procedure,
      Optional<UUID> centralFileFacilityId) {
    AddFacilityFileStateResponse facilityFileState =
        getFacilityFileState(facilitiesById, centralFileFacilityId);
    return getFacilityData(procedure, facilityFileState);
  }

  private static FacilityData getFacilityData(
      MeaslesProtectionProcedure procedure, AddFacilityFileStateResponse facilityDto) {
    Optional<Facility> facility = procedure.getFacility();
    if (facilityDto != null && facility.isPresent()) {
      String otherTypeInformation = facility.get().getOtherFacilityTypeInformation();
      MPFacilityTypeDto facilityType =
          MPFacilityTypeMapper.toInterfaceType(facility.get().getMpFacilityType());
      return new FacilityData(facilityType, facilityDto, otherTypeInformation);
    } else {
      return null;
    }
  }

  private static AddFacilityFileStateResponse getFacilityFileState(
      Map<UUID, AddFacilityFileStateResponse> facilitiesById,
      Optional<UUID> centralFileFacilityId) {
    final AddFacilityFileStateResponse facilityDto;
    if (centralFileFacilityId.isPresent()) {
      facilityDto = facilitiesById.get(centralFileFacilityId.get());
      Objects.requireNonNull(facilityDto, "Facility not found: " + centralFileFacilityId);
    } else {
      facilityDto = null;
    }
    return facilityDto;
  }

  @Transactional
  public ProcedureDetailsData updateProcedure(UUID id, UpdateProcedureRequest request) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(id);
    RoleStatus roleStatus = RoleStatusMapper.toDatabaseType(request.roleStatus());
    if (roleStatus != null) {
      procedure.getRelatedPersons().stream()
          .filter(Person::isPatient)
          .collect(StreamUtil.toSingleElement())
          .setRoleStatus(roleStatus);
    }

    ReportData reportData =
        ReportDataMapper.toDatabaseType(request.reportData(), procedure.getReportData());
    procedure.setReportData(reportData);
    return augmentProcedure(procedure);
  }

  @Transactional
  public ProcedureDetailsData updateCaseStatus(UUID id, CaseStatusDto request) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(id);
    CaseStatus newCaseStatus = CaseStatusMapper.toDatabaseType(request);

    SystemProgressEntry updateProgressEntry =
        createCaseStatusChangedProgressEntry(procedure.getCaseStatus(), newCaseStatus);
    procedure.setCaseStatus(newCaseStatus);
    procedure.addProgressEntry(updateProgressEntry);
    return augmentProcedure(procedure);
  }

  private SystemProgressEntry createCaseStatusChangedProgressEntry(
      CaseStatus oldCaseStatus, CaseStatus newCaseStatus) {
    return SystemProgressEntryFactory.createSystemProgressEntry(
        CASE_STATUS_CHANGED.name(),
        "Der Bearbeitungsstand wurde von '%s' auf '%s' geändert."
            .formatted(oldCaseStatus.getDisplayText(), newCaseStatus.getDisplayText()),
        TriggerType.SYSTEM_AUTOMATIC);
  }

  @Transactional(readOnly = true)
  public List<MeaslesProtectionProcedure> getProceduresForPerson(
      String firstName, String lastName, LocalDate dateOfBirth) {
    PersonFileStateIdsWithSameReferencePerson response =
        personClient.getPersonFileStateIdsWithSameReferencePerson(firstName, lastName, dateOfBirth);
    List<UUID> fileStateIds = response.fileStateIds();

    return personRepository.findAll(centralFileStateIdIn(fileStateIds)).stream()
        .map(RelatedPerson::getProcedure)
        .toList();
  }

  private Specification<Person> centralFileStateIdIn(Collection<UUID> values) {
    return (root, query, criteriaBuilder) -> {
      Assert.notNull(query, "CriteriaQuery must not be null");
      query.orderBy(criteriaBuilder.asc(root.get(Person_.id)));
      return root.get(RelatedPerson_.centralFileStateId).in(values);
    };
  }

  @Transactional
  public void deleteProcedure(UUID id) {
    procedureDeletionService.deleteAndWriteToCemetery(
        procedureFinder.findProcedureByExternalId(id));
  }
}
