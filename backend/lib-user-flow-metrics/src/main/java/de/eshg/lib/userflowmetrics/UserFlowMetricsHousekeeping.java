/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics;

import de.eshg.lib.userflowmetrics.persistence.UserFlowRepository;
import de.eshg.lib.userflowmetrics.spring.UserFlowMetricsProperties;
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
public class UserFlowMetricsHousekeeping {
  private static final Logger log = LoggerFactory.getLogger(UserFlowMetricsHousekeeping.class);

  private final Period maxAgeDays;
  private final Clock clock;
  private final UserFlowRepository userFlowRepository;

  public UserFlowMetricsHousekeeping(
      UserFlowMetricsProperties userFlowMetricsProperties,
      Clock clock,
      UserFlowRepository userFlowRepository) {
    this.maxAgeDays = userFlowMetricsProperties.getHousekeepingMaxAgeDays();
    this.clock = clock;
    this.userFlowRepository = userFlowRepository;
  }

  @Transactional
  @Scheduled(cron = "${de.eshg.user-flow-metrics.housekeeping.schedule:@daily}")
  @SchedulerLock(
      name = "LibUserFlowMetricsHousekeeping",
      lockAtMostFor = "${de.eshg.user-flow-metrics.housekeeping.lock-at-most-for:23h}")
  public void cleanupUserFlows() {
    LockAssert.assertLocked();
    Instant createdAtLimit = calculateCreatedAtLimit(maxAgeDays);
    log.info("Cleaning up user flows created before {}", createdAtLimit);
    long count = userFlowRepository.deleteByFlowStartLessThan(createdAtLimit);
    log.info("Deleted {} user flows", count);
  }

  private Instant calculateCreatedAtLimit(Period maxAgeDays) {
    return LocalDate.now(clock).atStartOfDay().minus(maxAgeDays).atZone(ZoneOffset.UTC).toInstant();
  }
}
