/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.util.ProcedureValidator;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.time.Clock;
import org.springframework.stereotype.Component;

@Component
public class ProcedureStatusUpdater {

  private final CitizenAccessCodeUserApi citizenUserApi;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public ProcedureStatusUpdater(
      CitizenAccessCodeUserApi citizenUserApi,
      ModuleClientAuthenticator moduleClientAuthenticator,
      Clock clock,
      AuditLogger auditLogger) {
    this.citizenUserApi = citizenUserApi;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public void initializeAsDraft(InfectionBriefingProcedure procedure) {
    new ProcedureValidator<>(procedure)
        .validateStatusNull()
        .get()
        .updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
  }

  public void initializeAsOpen(InfectionBriefingProcedure procedure) {
    new ProcedureValidator<>(procedure)
        .validateStatusNull()
        .get()
        .updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  public void open(InfectionBriefingProcedure procedure) {
    new ProcedureValidator<>(procedure)
        .validateStatus(ProcedureStatus.DRAFT)
        .get()
        .updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    removeCitizenUserIfPresent(procedure);
  }

  public void abort(InfectionBriefingProcedure procedure) {
    new ProcedureValidator<>(procedure)
        .validateStatus(ProcedureStatus.DRAFT)
        .get()
        .updateProcedureStatus(ProcedureStatus.ABORTED, clock, auditLogger);
    removeCitizenUserIfPresent(procedure);
  }

  public void close(InfectionBriefingProcedure procedure) {
    new ProcedureValidator<>(procedure)
        .validateStatus(ProcedureStatus.OPEN)
        .get()
        .updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
  }

  public void reopen(InfectionBriefingProcedure procedure) {
    new ProcedureValidator<>(procedure)
        .validateStatus(ProcedureStatus.CLOSED)
        .get()
        .updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  private void removeCitizenUserIfPresent(InfectionBriefingProcedure procedure) {
    if (procedure.getCitizenUserId() != null) {
      moduleClientAuthenticator.doWithPotentiallyReplacedModuleClientAuthenticator(
          () -> citizenUserApi.deleteCitizenAccessCodeUser(procedure.getCitizenUserId()));
    }
    procedure.setCitizenUserId(null);
  }
}
