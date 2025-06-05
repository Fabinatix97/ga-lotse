/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedureRepository;
import de.eshg.medsabroad.persistence.database.MedsAbroadTask;
import de.eshg.medsabroad.persistence.database.Person;
import de.eshg.medsabroad.persistence.support.MedsAbroadProcedureSpecification;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MedsAbroadService {

  private final MedsAbroadProcedureRepository medsAbroadProcedureRepository;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public MedsAbroadService(
      MedsAbroadProcedureRepository medsAbroadProcedureRepository,
      Clock clock,
      AuditLogger auditLogger) {
    this.medsAbroadProcedureRepository = medsAbroadProcedureRepository;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public MedsAbroadProcedure createProcedure() {
    MedsAbroadProcedure procedure = new MedsAbroadProcedure();
    procedure.setCertificatePaid(false);
    procedure.setProcedureType(ProcedureType.MEDS_ABROAD);
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    procedure.addTask(createTask());
    return medsAbroadProcedureRepository.save(procedure);
  }

  public void addPerson(MedsAbroadProcedure procedure, UUID centralFilePersonId) {
    Person person = new Person();
    person.setCentralFileStateId(centralFilePersonId);
    person.setPersonType(PersonType.PATIENT);
    procedure.addRelatedPerson(person);
  }

  public MedsAbroadProcedure findProcedureByExternalId(UUID procedureId) {
    return medsAbroadProcedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(() -> new NotFoundException("Procedure with given UUID not found"));
  }

  public Page<MedsAbroadProcedure> findProcedures(
      MedsAbroadProcedureSpecification specification, Pageable pageable) {
    return medsAbroadProcedureRepository.findAll(specification, pageable);
  }

  private MedsAbroadTask createTask() {
    MedsAbroadTask task = new MedsAbroadTask();
    task.setTaskType(TaskType.MEDS_ABROAD);
    task.setTaskStatus(TaskStatus.OPEN);
    task.assign(
        CurrentUserHelper.getCurrentUserId(),
        CurrentUserHelper.getCurrentUserId(),
        Instant.now(clock));
    return task;
  }

  public void closeProcedure(MedsAbroadProcedure procedure) {
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (procedureStatus.isOpen()) {
      procedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    } else {
      throw unexpectedProcedureStatus(procedure.getExternalId(), procedureStatus);
    }
  }

  public void cancelProcedure(MedsAbroadProcedure procedure) {
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (procedureStatus.isOpen()) {
      procedure.updateProcedureStatus(ProcedureStatus.ABORTED, clock, auditLogger);
    } else {
      throw unexpectedProcedureStatus(procedure.getExternalId(), procedureStatus);
    }
  }

  public void reopenProcedure(MedsAbroadProcedure procedure) {
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (!procedureStatus.isOpen()) {
      procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    } else {
      throw unexpectedProcedureStatus(procedure.getExternalId(), procedureStatus);
    }
  }

  protected static BadRequestException unexpectedProcedureStatus(
      UUID procedureId, ProcedureStatus procedureStatus) {
    return new BadRequestException(
        "%s: unexpected procedure status: %s".formatted(procedureId, procedureStatus));
  }
}
