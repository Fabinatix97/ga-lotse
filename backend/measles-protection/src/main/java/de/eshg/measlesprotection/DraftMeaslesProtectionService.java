/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.measlesprotection.api.PersonBaseDto.AGE_OF_MATURITY_IN_YEARS;
import static de.eshg.measlesprotection.mapper.ToDtoMappers.getFirstEmailAddress;
import static de.eshg.measlesprotection.mapper.ToDtoMappers.getFirstPhoneNumber;
import static de.eshg.measlesprotection.persistence.Assertions.assertProcedureStatus;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.measlesprotection.api.FacilityContactPersonDto;
import de.eshg.measlesprotection.api.FacilityDto;
import de.eshg.measlesprotection.api.draft.AddFacilityRequest;
import de.eshg.measlesprotection.api.draft.AddFacilityResponse;
import de.eshg.measlesprotection.mapper.FacilityContactPersonMapper;
import de.eshg.measlesprotection.mapper.MPFacilityTypeMapper;
import de.eshg.measlesprotection.persistence.db.CaseStatus;
import de.eshg.measlesprotection.persistence.db.Facility;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedureRepository;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionTask;
import de.eshg.measlesprotection.persistence.db.Person;
import de.eshg.measlesprotection.persistence.db.ReportData;
import de.eshg.measlesprotection.persistence.db.RoleStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DraftMeaslesProtectionService {

  private final PersonApi personApi;
  private final FacilityApi facilityApi;
  private final MeaslesProtectionProcedureRepository repository;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public DraftMeaslesProtectionService(
      PersonApi personApi,
      FacilityApi facilityApi,
      MeaslesProtectionProcedureRepository procedures,
      Clock clock,
      AuditLogger auditLogger) {
    this.personApi = personApi;
    this.facilityApi = facilityApi;
    this.repository = procedures;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  @Transactional
  public MeaslesProtectionProcedure addPerson(AddPersonFileStateRequest addPerson) {
    AddPersonFileStateResponse personFileStateResponse = personApi.addPersonFileState(addPerson);
    Person person = createPerson(personFileStateResponse);
    return saveProcedure(person);
  }

  private static Person createPerson(AddPersonFileStateResponse personFileStateResponse) {
    Person person = new Person();
    person.setCentralFileStateId(personFileStateResponse.id());
    person.setPersonType(PersonType.PATIENT);
    return person;
  }

  private MeaslesProtectionProcedure saveProcedure(Person person) {
    MeaslesProtectionProcedure procedure = new MeaslesProtectionProcedure();
    procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
    procedure.setProcedureType(ProcedureType.MEASLES_PROTECTION);
    procedure.addRelatedPerson(person);
    procedure.addTask(createTask());
    procedure.setCaseStatus(CaseStatus.PROCEDURE_VALIDATION);
    return repository.save(procedure);
  }

  private MeaslesProtectionTask createTask() {
    MeaslesProtectionTask task = new MeaslesProtectionTask();
    task.setTaskType(TaskType.MEASLES_PROTECTION);
    task.setTaskStatus(TaskStatus.OPEN);
    task.assign(
        CurrentUserHelper.getCurrentUserId(),
        CurrentUserHelper.getCurrentUserId(),
        Instant.now(clock));
    return task;
  }

  @Transactional
  public MeaslesProtectionProcedure addCustodian(UUID id, AddPersonFileStateRequest addCustodian) {
    MeaslesProtectionProcedure procedure = findDraftByExternalId(id);
    AddPersonFileStateResponse personFileStateResponse = personApi.addPersonFileState(addCustodian);
    Person custodian = new Person();
    custodian.setCentralFileStateId(personFileStateResponse.id());
    custodian.setPersonType(PersonType.PARENT);
    procedure.addRelatedPerson(custodian);
    return procedure;
  }

  private MeaslesProtectionProcedure findDraftByExternalId(UUID id) {
    MeaslesProtectionProcedure procedure =
        repository
            .findByExternalId(id)
            .orElseThrow(() -> new NotFoundException("%s: no such procedure".formatted(id)));
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    assertProcedureStatus(id, ProcedureStatus.DRAFT, procedureStatus);
    return procedure;
  }

  @Transactional
  public AddFacilityResponse addFacility(UUID id, AddFacilityRequest addFacilityRequest) {
    MeaslesProtectionProcedure procedure = findDraftByExternalId(id);
    if (procedure.getFacility().isPresent()) {
      throw new BadRequestException("Facility already exists.");
    }

    AddFacilityFileStateResponse facilityFileState =
        facilityApi.addFacilityFileState(addFacilityRequest.facility());

    Facility facility = new Facility();
    facility.setFacilityType(FacilityType.OTHER);
    facility.setMpFacilityType(MPFacilityTypeMapper.toDomainType(addFacilityRequest.type()));
    facility.setCentralFileStateId(facilityFileState.id());
    facility.setOtherFacilityTypeInformation(addFacilityRequest.otherFacilityTypeInformation());
    procedure.addRelatedFacility(facility);
    List<FacilityContactPersonDto> contactPersons =
        FacilityContactPersonMapper.map(facilityFileState.contactPersons());

    FacilityDto facilityDto =
        new FacilityDto(
            facilityFileState.name(),
            contactPersons,
            addFacilityRequest.type(),
            addFacilityRequest.otherFacilityTypeInformation(),
            getFirstPhoneNumber(addFacilityRequest.facility()),
            getFirstEmailAddress(addFacilityRequest.facility()),
            facilityFileState.contactAddress(),
            facilityFileState.differentBillingAddress());
    return new AddFacilityResponse(procedure.getExternalId(), facilityDto);
  }

  @Transactional
  public MeaslesProtectionProcedure openProcedure(
      UUID id, ReportData reportData, RoleStatus roleStatus) {
    MeaslesProtectionProcedure procedure = findDraftByExternalId(id);
    requireFacility(procedure);
    requireCustodian(procedure);
    procedure.setReportData(reportData);
    procedure.getRelatedPersons().stream()
        .filter(Person::isPatient)
        .collect(StreamUtil.toSingleElement())
        .setRoleStatus(roleStatus);

    procedure.setCaseStatus(CaseStatus.PROCEDURE_RECORDED);
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    return procedure;
  }

  private void requireCustodian(MeaslesProtectionProcedure procedure) {
    UUID patientId = procedure.getPatientIdFromCentralFile();
    GetPersonFileStateResponse personFileState = personApi.getPersonFileState(patientId);
    LocalDate dateOfBirth = personFileState.dateOfBirth();
    boolean adult =
        Period.between(dateOfBirth, LocalDate.now(clock)).getYears() >= AGE_OF_MATURITY_IN_YEARS;
    if (!adult && procedure.getCustodianIdsFromCentralFile().isEmpty()) {
      throw new BadRequestException(
          "%s: invalid procedure: an underage patient needs at least one custodian"
              .formatted(procedure.getExternalId()));
    }
  }

  private static void requireFacility(MeaslesProtectionProcedure procedure) {
    if (procedure.getFacility().isEmpty()) {
      throw new BadRequestException(
          "%s: the procedure is missing a required facility".formatted(procedure.getExternalId()));
    }
  }
}
