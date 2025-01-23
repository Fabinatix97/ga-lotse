/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.cemetery;

import de.eshg.lib.procedure.domain.repository.CemeteryRepository;
import jakarta.transaction.Transactional;
import java.time.Clock;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CemeteryHousekeeping {
  private static final Logger logger = LoggerFactory.getLogger(CemeteryHousekeeping.class);
  private final CemeteryRepository repository;
  private final Clock clock;

  public CemeteryHousekeeping(CemeteryRepository repository, Clock clock) {
    this.repository = repository;
    this.clock = clock;
  }

  @Scheduled(cron = "${de.eshg.lib.procedure.housekeeping.cemetery.schedule:@daily}")
  @Transactional
  void run() {
    logger.info("Attempting to delete all cemetery entries with deleteAfter in the past");
    long numberOfDeletedEntries = repository.deleteByDeleteAtBefore(Instant.now(clock));
    logger.info("Successfully deleted {} cemetery entries", numberOfDeletedEntries);
  }
}
