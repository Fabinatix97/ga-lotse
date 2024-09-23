/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.measlesprotection.api.RoleStatusDto;
import de.eshg.measlesprotection.api.citizenportal.AffectedPersonSupplementalDataDto;
import de.eshg.measlesprotection.api.citizenportal.ReportCaseRequest;
import de.eshg.measlesprotection.api.draft.AffectedPersonDetailsDto;
import de.eshg.measlesprotection.api.draft.CustodianDetailsDto;
import de.eshg.measlesprotection.mapper.AffectedPersonDetailsMapper;
import de.eshg.measlesprotection.mapper.MPFacilityTypeMapper;
import de.eshg.measlesprotection.mapper.ReportDataMapper;
import de.eshg.measlesprotection.mapper.RoleStatusMapper;
import de.eshg.measlesprotection.persistence.db.CaseStatus;
import de.eshg.measlesprotection.persistence.db.Facility;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedureRepository;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionTask;
import de.eshg.measlesprotection.persistence.db.Person;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrganisationPortalService {

  private static final UUID WELL_KNOWN_ORGANISATION_USER_ID =
      UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

  private final PersonApi personApi;
  private final FacilityApi facilityApi;
  private final MeaslesProtectionProcedureRepository repository;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public OrganisationPortalService(
      PersonApi personApi,
      FacilityApi facilityApi,
      MeaslesProtectionProcedureRepository repository,
      Clock clock,
      AuditLogger auditLogger) {
    this.personApi = personApi;
    this.facilityApi = facilityApi;
    this.repository = repository;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  @Transactional
  public void reportCases(ReportCaseRequest request) {
    for (var affectedPersonDetails : request.affectedPersons()) {

      MeaslesProtectionProcedure procedure = new MeaslesProtectionProcedure();
      procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
      procedure.setProcedureType(ProcedureType.MEASLES_PROTECTION);
      procedure.setCaseStatus(CaseStatus.PROCEDURE_VALIDATION);
      procedure.addTask(createTask());
      procedure.setOrganisationUserId(WELL_KNOWN_ORGANISATION_USER_ID);

      AffectedPersonDetailsDto affectedPersonDto = affectedPersonDetails.affectedPersonDetails();
      AffectedPersonSupplementalDataDto roleReportData =
          affectedPersonDetails.affectedPersonSupplementalData();
      Person affectedPerson =
          addAffectedPersonFromExternalSource(affectedPersonDto, roleReportData.roleStatus());
      procedure.addRelatedPerson(affectedPerson);
      procedure.setReportData(ReportDataMapper.toDatabaseType(roleReportData.reportData()));

      for (CustodianDetailsDto custodianDto : affectedPersonDto.custodians()) {
        Person custodian = addCustodianFromExternalSource(custodianDto);
        procedure.addRelatedPerson(custodian);
      }

      Facility facility = addFacilityFromExternalSource(request);
      procedure.addRelatedFacility(facility);

      repository.save(procedure);
    }
  }

  private Person addAffectedPersonFromExternalSource(
      AffectedPersonDetailsDto affectedPersonDto, RoleStatusDto roleStatus) {
    AddPersonFileStateResponse personFileStateResponse =
        personApi.addPersonFromExternalSource(
            AffectedPersonDetailsMapper.getExternalAddPersonRequest(affectedPersonDto));

    Person person = new Person();
    person.setCentralFileStateId(personFileStateResponse.id());
    person.setPersonType(PersonType.PATIENT);
    person.setRoleStatus(RoleStatusMapper.toDatabaseType(roleStatus));

    return person;
  }

  private Person addCustodianFromExternalSource(CustodianDetailsDto custodianDto) {
    AddPersonFileStateResponse personFileStateResponse =
        personApi.addPersonFromExternalSource(
            AffectedPersonDetailsMapper.getExternalAddPersonRequest(custodianDto));
    Person person = new Person();
    person.setCentralFileStateId(personFileStateResponse.id());
    person.setPersonType(PersonType.PARENT);
    return person;
  }

  private Facility addFacilityFromExternalSource(ReportCaseRequest request) {
    AddFacilityFileStateResponse facilityFileState =
        facilityApi.addFacilityFromExternalSource(request.facility());

    Facility facility = new Facility();
    facility.setFacilityType(FacilityType.OTHER);
    facility.setMpFacilityType(MPFacilityTypeMapper.toDomainType(request.type()));
    facility.setCentralFileStateId(facilityFileState.id());
    facility.setOtherFacilityTypeInformation(request.otherFacilityTypeInformation());

    return facility;
  }

  private MeaslesProtectionTask createTask() {
    MeaslesProtectionTask task = new MeaslesProtectionTask();
    task.setTaskType(TaskType.MEASLES_PROTECTION);
    task.setTaskStatus(TaskStatus.OPEN);
    task.assign(
        WELL_KNOWN_ORGANISATION_USER_ID, WELL_KNOWN_ORGANISATION_USER_ID, Instant.now(clock));
    return task;
  }
}
