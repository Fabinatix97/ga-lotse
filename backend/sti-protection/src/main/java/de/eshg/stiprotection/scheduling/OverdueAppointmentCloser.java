/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.scheduling;

import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.stiprotection.AppointmentService;
import de.eshg.stiprotection.StiProtectionProcedureFinder;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import de.eshg.stiprotection.util.ProgressEntryUtil;
import java.time.Clock;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class OverdueAppointmentCloser {

  private final StiProtectionProcedureRepository procedureRepository;
  private final AppointmentService appointmentService;
  private final ProgressEntryUtil progressEntryUtil;
  private final Clock clock;

  public OverdueAppointmentCloser(
      StiProtectionProcedureFinder procedureFinder,
      StiProtectionProcedureRepository procedures,
      AppointmentService appointmentService,
      ProgressEntryUtil progressEntryUtil,
      Clock clock) {
    this.procedureRepository = procedures;
    this.appointmentService = appointmentService;
    this.progressEntryUtil = progressEntryUtil;
    this.clock = clock;
  }

  @Scheduled(cron = "${eshg.sti-protection.passed-appointment.cron}")
  @SchedulerLock(name = "OverdueAppointmentCloser", lockAtMostFor = "1m", lockAtLeastFor = "30s")
  @Transactional
  public void scheduleRun() {
    LockAssert.assertLocked();
    finalizePassedAppointments();
  }

  public void finalizePassedAppointments() {
    procedureRepository
        .findAllAppointmentsWithEndBeforeOrEqual(clock.instant())
        .forEach(
            procedure -> {
              appointmentService.finalizeAppointment(procedure);
              progressEntryUtil.addProgressEntry(
                  procedure,
                  StiProtectionSystemProgressEntryType.APPOINTMENT_FINALIZED,
                  TriggerType.SYSTEM_AUTOMATIC);
            });
  }
}
