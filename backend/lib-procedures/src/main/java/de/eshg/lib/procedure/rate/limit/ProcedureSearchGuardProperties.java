/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.rate.limit;

import jakarta.validation.constraints.Positive;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;

@ConfigurationProperties(
    prefix = ProcedureSearchGuardProperties.PREFIX,
    ignoreUnknownFields = false)
public class ProcedureSearchGuardProperties {

  static final String PREFIX = "de.eshg.lib.procedure.search-guard";

  private boolean enabled = true;

  @Positive
  @DurationUnit(ChronoUnit.MINUTES)
  private Duration intervalInMinutes = Duration.ofMinutes(1);

  @Positive private int capacity = 100;

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public Duration getIntervalInMinutes() {
    return intervalInMinutes;
  }

  public void setIntervalInMinutes(Duration intervalInMinutes) {
    this.intervalInMinutes = intervalInMinutes;
  }

  public int getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity;
  }
}
