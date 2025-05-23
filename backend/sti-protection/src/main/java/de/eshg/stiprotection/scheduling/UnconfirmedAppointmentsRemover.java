/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.scheduling;

import de.eshg.stiprotection.AbstractExpiredEntityRemover;
import de.eshg.stiprotection.CitizenAppointmentService;
import de.eshg.stiprotection.persistence.db.ProcedureExpiration;
import de.eshg.stiprotection.persistence.db.ProcedureExpirationRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UnconfirmedAppointmentsRemover
    extends AbstractExpiredEntityRemover<ProcedureExpiration> {

  private final ProcedureExpirationRepository procedureExpirationRepository;
  private final StiProtectionProcedureRepository procedureRepository;
  private final CitizenAppointmentService citizenAppointmentService;

  public UnconfirmedAppointmentsRemover(
      ProcedureExpirationRepository procedureExpirationRepository,
      StiProtectionProcedureRepository procedureRepository,
      CitizenAppointmentService citizenAppointmentService,
      Clock clock,
      @Value("${eshg.sti-protection.unconfirmed-appointments.expire-after:1h}")
          Duration expireAfter,
      @Value("${eshg.sti-protection.unconfirmed-appointments.page-size:100}") int pageSize) {
    super(clock, expireAfter, pageSize);
    this.procedureExpirationRepository = procedureExpirationRepository;
    this.procedureRepository = procedureRepository;
    this.citizenAppointmentService = citizenAppointmentService;
  }

  @Scheduled(cron = "${eshg.sti-protection.unconfirmed-appointments.cron:@hourly}")
  @SchedulerLock(
      name = "UnconfirmedAppointmentsRemover",
      lockAtMostFor = "30m",
      lockAtLeastFor = "1m")
  @Transactional
  public void scheduleRun() {
    LockAssert.assertLocked();
    run();
  }

  @Transactional
  public void runNow() {
    run();
  }

  @Override
  protected Page<ProcedureExpiration> fetchExpiredEntities(
      Instant retentionTime, Pageable pageable) {
    return procedureExpirationRepository.findByCreatedAtBefore(retentionTime, pageable);
  }

  @Override
  protected void processEntity(ProcedureExpiration procedureExpiration) {
    UUID procedureExternalId = procedureExpiration.getProcedureExternalId();
    try {
      procedureRepository.findByExternalId(procedureExternalId).ifPresent(this::removeExpired);
      procedureExpirationRepository.delete(procedureExpiration);
    } catch (RuntimeException e) {
      log.error("Error deleting procedure with ID {}", procedureExternalId, e);
    }
  }

  private void removeExpired(StiProtectionProcedure procedure) {
    UUID anonymousUserId = procedure.getAnonymousUserId();
    if (anonymousUserId != null) {
      try {
        citizenAppointmentService.deleteCitizenAccessCodeUser(anonymousUserId);
      } catch (RuntimeException e) {
        log.warn("Error deleting user with ID {}", anonymousUserId, e);
      }
    }
    procedureRepository.delete(procedure);
  }
}
