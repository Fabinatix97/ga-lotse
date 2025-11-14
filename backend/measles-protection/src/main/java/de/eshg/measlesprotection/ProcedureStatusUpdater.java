/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.CLOSED_BECAUSE_VACCINATION_FOUND_IN_SCHOOL_ENTRY;

import de.eshg.base.config.PublicConfigApi;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.measlesprotection.persistence.Assertions;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.Person;
import de.eshg.measlesprotection.vaccinationcheck.VaccinationCheckService;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProcedureStatusUpdater {

  private final ProcedureFinder procedureFinder;
  private final VaccinationCheckService vaccinationCheckService;
  private final PublicConfigApi publicConfigApi;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public ProcedureStatusUpdater(
      ProcedureFinder procedureFinder,
      VaccinationCheckService vaccinationCheckService,
      PublicConfigApi publicConfigApi,
      Clock clock,
      AuditLogger auditLogger) {
    this.procedureFinder = procedureFinder;
    this.vaccinationCheckService = vaccinationCheckService;
    this.publicConfigApi = publicConfigApi;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  @Transactional
  public void closeVaccinatedProcedure(UUID procedureId) {
    assertSchoolEntryActive();
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);
    assertDraftOrOpen(procedure.getProcedureStatus());
    assertFullyVaccinated(procedure.getPatient());
    procedure.addProgressEntry(
        SystemProgressEntryFactory.createSystemProgressEntry(
            CLOSED_BECAUSE_VACCINATION_FOUND_IN_SCHOOL_ENTRY.name(),
            "Vollständige Masernimpfung aus ESU-Fachverfahren bekannt",
            TriggerType.SYSTEM_AUTOMATIC));
    procedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
  }

  @Transactional
  public void closeProcedure(UUID procedureId) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    Assertions.assertProcedureStatus(procedureId, ProcedureStatus.OPEN, procedureStatus);
    procedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
  }

  @Transactional
  public void reopenProcedure(UUID procedureId) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    Assertions.assertProcedureStatus(procedureId, ProcedureStatus.CLOSED, procedureStatus);
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  private void assertDraftOrOpen(ProcedureStatus procedureStatus) {
    if (procedureStatus != ProcedureStatus.DRAFT) {
      throw new BadRequestException(
          "Cannot close procedure with status %s".formatted(procedureStatus));
    }
  }

  private void assertSchoolEntryActive() {
    if (!publicConfigApi.getConfig().activeModules().contains(BusinessModule.SCHOOL_ENTRY)) {
      throw new BadRequestException("Vaccination check not possible");
    }
  }

  private void assertFullyVaccinated(Person patient) {
    if (!vaccinationCheckService.isFullyVaccinated(patient)) {
      throw new BadRequestException("Patient is not fully vaccinated");
    }
  }
}
