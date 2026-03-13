/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.spring;

import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;

@ConfigurationProperties(value = "de.eshg.user-flow-metrics")
public class UserFlowMetricsProperties {

  @NotNull
  @DurationUnit(ChronoUnit.MINUTES)
  private Duration countAsAbortedAfterMinutes = Duration.ofMinutes(60);

  public Duration getCountAsAbortedAfterMinutes() {
    return countAsAbortedAfterMinutes;
  }

  public void setCountAsAbortedAfterMinutes(Duration countAsAbortedAfterMinutes) {
    this.countAsAbortedAfterMinutes = countAsAbortedAfterMinutes;
  }
}
