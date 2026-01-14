/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.eshg.lib.statistics.persistence.ProcedureReferenceForStatisticsRepository;
import de.eshg.lib.statistics.spring.config.StatisticsHousekeepingProperties;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneOffset;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class StatisticsHousekeeping {
  private static final Logger log = LoggerFactory.getLogger(StatisticsHousekeeping.class);

  private final StatisticsHousekeepingProperties statisticsHousekeepingProperties;
  private final ProcedureReferenceForStatisticsRepository procedureReferenceForStatisticsRepository;
  private final Clock clock;

  public StatisticsHousekeeping(
      StatisticsHousekeepingProperties statisticsHousekeepingProperties,
      ProcedureReferenceForStatisticsRepository procedureReferenceForStatisticsRepository,
      Clock clock) {
    this.statisticsHousekeepingProperties = statisticsHousekeepingProperties;
    this.procedureReferenceForStatisticsRepository = procedureReferenceForStatisticsRepository;
    this.clock = clock;
  }

  @Scheduled(cron = "${de.eshg.statistics.housekeeping.schedule:@daily}")
  @SchedulerLock(
      name = "StatisticsHousekeeping",
      lockAtMostFor = "${de.eshg.statistics.housekeeping.lock-at-most-for:23h}")
  @Transactional
  public void housekeeping() {
    LockAssert.assertLocked();
    deleteProcedureReferences();
  }

  public void deleteProcedureReferences() {
    Instant createdAtLimit =
        calculateCreatedAtLimit(
            statisticsHousekeepingProperties.getProcedureReferencesMaxAgeDays());
    log.info("Cleaning up procedure references for statistics created before {}", createdAtLimit);

    long numberOfDeletedReferences =
        procedureReferenceForStatisticsRepository
            .deleteProcedureReferenceForStatisticsByCreatedAtLessThan(createdAtLimit);
    log.info("Deleted {} procedure references for statistics", numberOfDeletedReferences);
  }

  private Instant calculateCreatedAtLimit(Period maxAgeDays) {
    return LocalDate.now(clock).atStartOfDay().minus(maxAgeDays).atZone(ZoneOffset.UTC).toInstant();
  }
}
