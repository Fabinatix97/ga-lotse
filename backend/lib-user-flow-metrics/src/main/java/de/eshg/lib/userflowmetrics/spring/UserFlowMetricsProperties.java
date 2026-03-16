/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.spring;

import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.boot.convert.PeriodUnit;

@ConfigurationProperties(value = "de.eshg.user-flow-metrics")
public class UserFlowMetricsProperties {

  @NotNull
  @DurationUnit(ChronoUnit.MINUTES)
  private Duration countAsAbortedAfterMinutes = Duration.ofMinutes(60);

  @NotNull
  @PeriodUnit(ChronoUnit.DAYS)
  private Period housekeepingMaxAgeDays = Period.ofDays(366);

  public Duration getCountAsAbortedAfterMinutes() {
    return countAsAbortedAfterMinutes;
  }

  public void setCountAsAbortedAfterMinutes(Duration countAsAbortedAfterMinutes) {
    this.countAsAbortedAfterMinutes = countAsAbortedAfterMinutes;
  }

  public Period getHousekeepingMaxAgeDays() {
    return housekeepingMaxAgeDays;
  }

  public void setHousekeepingMaxAgeDays(Period housekeepingMaxAgeDays) {
    this.housekeepingMaxAgeDays = housekeepingMaxAgeDays;
  }
}
