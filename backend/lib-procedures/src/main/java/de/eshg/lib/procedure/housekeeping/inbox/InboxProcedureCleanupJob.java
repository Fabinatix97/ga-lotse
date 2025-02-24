/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.inbox;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.procedure.domain.model.view.IdView;
import de.eshg.lib.procedure.domain.repository.InboxProcedureRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class InboxProcedureCleanupJob {
  private static final Logger logger = LoggerFactory.getLogger(InboxProcedureCleanupJob.class);
  private final InboxProcedureRepository inboxProcedureRepository;
  private final int retentionTimeDays;
  private final Clock clock;

  public InboxProcedureCleanupJob(
      InboxProcedureRepository inboxProcedureRepository,
      @Value("${de.eshg.lib.procedure.housekeeping.inbox.retentionTimeDays:365}")
          int retentionTimeDays,
      Clock clock) {
    this.inboxProcedureRepository = inboxProcedureRepository;
    this.retentionTimeDays = validateRetentionTime(retentionTimeDays);
    this.clock = clock;
  }

  @Scheduled(cron = "${de.eshg.lib.procedure.housekeeping.inbox.schedule:@daily}")
  @SchedulerLock(
      name = "LibProceduresInboxProcedureCleanupJob",
      lockAtMostFor = "${de.eshg.lib.procedure.housekeeping.inbox.lock-at-most-for:23h}")
  void run() {
    LockAssert.assertLocked();
    Set<Long> inboxProceduresForDeletion = getInboxProcedures();
    logger.info("Attempting to delete {} inbox procedures", inboxProceduresForDeletion.size());
    if (logger.isDebugEnabled()) {
      logger.debug(
          "Technical inbox procedure ids: {}",
          inboxProceduresForDeletion.stream()
              .map(Object::toString)
              .collect(Collectors.joining(", ")));
    }

    inboxProcedureRepository.deleteAllById(inboxProceduresForDeletion);
    logger.info("Successful");
  }

  private Set<Long> getInboxProcedures() {
    Instant retentionExpirationDay =
        LocalDate.now(clock).minusDays(retentionTimeDays).atStartOfDay(clock.getZone()).toInstant();

    return inboxProcedureRepository.findByClosedAtBefore(retentionExpirationDay).stream()
        .map(IdView::getId)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private int validateRetentionTime(int retentionTime) {
    if (retentionTime < 0) {
      throw new IllegalArgumentException(
          "de.eshg.lib.procedure.housekeeping.inbox.retentionTimeDays must not be negative");
    }
    return retentionTime;
  }
}
