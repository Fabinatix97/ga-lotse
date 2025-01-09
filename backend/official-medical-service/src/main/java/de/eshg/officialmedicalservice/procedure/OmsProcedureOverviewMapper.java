/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureOverviewDto;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsTask;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class OmsProcedureOverviewMapper {
  private final Clock clock;
  private final AuditLogger auditLogger;

  public OmsProcedureOverviewMapper(Clock clock, AuditLogger auditLogger) {
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public OmsProcedure toDomainType(
      PostEmployeeOmsProcedureRequest request,
      UUID currentUserId,
      AddPersonFileStateResponse affectedPersonBaseResponse) {

    OmsProcedure procedure = new OmsProcedure();

    procedure.setProcedureType(ProcedureType.OFFICIAL_MEDICAL_SERVICE);
    procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);

    OmsTask omsTask = new OmsTask();
    if (currentUserId != null) {
      omsTask.assign(currentUserId, currentUserId, Instant.now(clock));
    }
    omsTask.setTaskType(TaskType.TRAVEL_MEDICINE);
    omsTask.setTaskStatus(TaskStatus.OPEN);
    procedure.addTask(omsTask);

    Person affectedPerson = new Person();
    affectedPerson.setCentralFileStateId(affectedPersonBaseResponse.id());
    affectedPerson.setProcedure(procedure);
    affectedPerson.setPersonType(PersonType.PATIENT);

    procedure.getRelatedPersons().add(affectedPerson);

    return procedure;
  }

  public EmployeeOmsProcedureOverviewDto toInterfaceType(
      OmsProcedure procedure,
      GetPersonFileStateResponse affectedPerson,
      GetFacilityFileStateResponse facility) {
    String firstName = null;
    String lastName = null;
    LocalDate dateOfBirth = null;
    String facilityName = null;
    if (affectedPerson != null) {
      firstName = affectedPerson.firstName();
      lastName = affectedPerson.lastName();
      dateOfBirth = affectedPerson.dateOfBirth();
    }
    if (facility != null) {
      facilityName = facility.name();
    }

    return new EmployeeOmsProcedureOverviewDto(
        procedure.getExternalId(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        firstName,
        lastName,
        dateOfBirth,
        facilityName);
  }
}
