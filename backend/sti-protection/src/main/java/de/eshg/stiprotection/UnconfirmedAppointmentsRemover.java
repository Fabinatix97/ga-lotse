/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.stiprotection.persistence.db.ProcedureExpiration;
import de.eshg.stiprotection.persistence.db.ProcedureExpirationRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UnconfirmedAppointmentsRemover {

  private static final Logger log = LoggerFactory.getLogger(UnconfirmedAppointmentsRemover.class);

  private final ProcedureExpirationRepository procedureExpirationRepository;
  private final StiProtectionProcedureRepository procedureRepository;
  private final CitizenAppointmentService citizenAppointmentService;
  private final Clock clock;

  @Value("${eshg.sti-protection.unconfirmed-appointments.expire-after:1h}")
  private Duration expireAfter;

  @Value("${eshg.sti-protection.unconfirmed-appointments.page-size:100}")
  private int pageSize;

  public UnconfirmedAppointmentsRemover(
      ProcedureExpirationRepository procedureExpirationRepository,
      StiProtectionProcedureRepository procedureRepository,
      CitizenAppointmentService citizenAppointmentService,
      Clock clock) {
    this.procedureExpirationRepository = procedureExpirationRepository;
    this.procedureRepository = procedureRepository;
    this.citizenAppointmentService = citizenAppointmentService;
    this.clock = clock;
  }

  @Scheduled(cron = "${eshg.sti-protection.unconfirmed-appointments.cron:@hourly}")
  @SchedulerLock(
      name = "UnconfirmedAppointmentsRemover",
      lockAtMostFor = "30m",
      lockAtLeastFor = "1m")
  @Transactional
  public void run() {
    LockAssert.assertLocked();
    remove();
  }

  void remove() {
    Instant retentionTime = Instant.now(clock).minus(expireAfter);
    log.debug(
        "expireAfter = {}, retentionTime = {}, pageSize = {}",
        expireAfter,
        retentionTime,
        pageSize);
    Page<ProcedureExpiration> expiredPage;
    int pageNumber = 0;
    do {
      expiredPage =
          procedureExpirationRepository.findByCreatedAtBefore(
              retentionTime, PageRequest.of(pageNumber, pageSize));
      List<ProcedureExpiration> expired = expiredPage.getContent();
      log.debug("{} expired procedures found in batch", expired.size());
      for (ProcedureExpiration procedureExpiration : expired) {
        UUID procedureExternalId = procedureExpiration.getProcedureExternalId();
        log.debug("deleting expired procedure = {}", procedureExternalId);
        try {
          procedureRepository.findByExternalId(procedureExternalId).ifPresent(this::removeExpired);
          procedureExpirationRepository.delete(procedureExpiration);
        } catch (RuntimeException e) {
          log.error("Error deleting procedure with ID {}", procedureExternalId, e);
        }
      }
      pageNumber++;
    } while (!expiredPage.isLast());
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

  public Duration getExpireAfter() {
    return expireAfter;
  }
}
