/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.measlesprotection.persistence.Assertions;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProcedureStatusUpdater {

  private final ProcedureFinder procedureFinder;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public ProcedureStatusUpdater(
      ProcedureFinder procedureFinder, Clock clock, AuditLogger auditLogger) {
    this.procedureFinder = procedureFinder;
    this.clock = clock;
    this.auditLogger = auditLogger;
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
}
