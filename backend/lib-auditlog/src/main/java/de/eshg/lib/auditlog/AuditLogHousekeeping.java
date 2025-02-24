/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.lib.auditlog.domain.AuditLogEntryRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuditLogHousekeeping {

  private static final Logger log = LoggerFactory.getLogger(AuditLogHousekeeping.class);

  private static final Period RETENTION_PERIOD = Period.ofDays(5);

  private final AuditLogEntryRepository auditLogEntryRepository;
  private final Clock clock;

  public AuditLogHousekeeping(AuditLogEntryRepository auditLogEntryRepository, Clock clock) {
    this.auditLogEntryRepository = auditLogEntryRepository;
    this.clock = clock;
  }

  @Scheduled(cron = "0 0 4 * * *")
  @SchedulerLock(name = "LibAuditLogAuditLogHousekeeping", lockAtMostFor = "23h")
  @Transactional
  public void runHousekeeping() {
    LockAssert.assertLocked();
    Instant retentionThreshold =
        LocalDate.now(clock).atStartOfDay(clock.getZone()).toInstant().minus(RETENTION_PERIOD);
    log.info(
        "Starting auditlog housekeeping - attempting to delete all entries created before {}",
        retentionThreshold);
    long numberOfEntriesDeleted =
        auditLogEntryRepository.deleteAuditLogEntryByCreatedAtBefore(retentionThreshold);
    log.info("{} entries deleted", numberOfEntriesDeleted);
  }
}
