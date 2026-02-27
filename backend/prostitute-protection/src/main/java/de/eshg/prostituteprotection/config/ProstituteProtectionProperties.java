/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.config;

import de.eshg.testhelper.ResettableProperties;
import jakarta.validation.constraints.Positive;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;

@ConfigurationProperties(prefix = "de.eshg.prostitute-protection")
public class ProstituteProtectionProperties implements ResettableProperties {

  @Positive
  @DurationUnit(ChronoUnit.MINUTES)
  private Duration rateLimitIntervalMinutes = Duration.ofMinutes(1);

  @Positive private int rateLimitCapacity = 100;

  @Positive
  @DurationUnit(ChronoUnit.MINUTES)
  private Duration gdprExportRateLimitIntervalMinutes = Duration.ofMinutes(1);

  @Positive private int gdprExportRateLimitCapacity = 100;

  public @Positive Duration getRateLimitIntervalMinutes() {
    return rateLimitIntervalMinutes;
  }

  public void setRateLimitIntervalMinutes(@Positive Duration rateLimitIntervalMinutes) {
    this.rateLimitIntervalMinutes = rateLimitIntervalMinutes;
  }

  @Positive
  public int getRateLimitCapacity() {
    return rateLimitCapacity;
  }

  public void setRateLimitCapacity(@Positive int rateLimitCapacity) {
    this.rateLimitCapacity = rateLimitCapacity;
  }

  public @Positive Duration getGdprExportRateLimitIntervalMinutes() {
    return gdprExportRateLimitIntervalMinutes;
  }

  public void setGdprExportRateLimitIntervalMinutes(
      @Positive Duration gdprExportRateLimitIntervalMinutes) {
    this.gdprExportRateLimitIntervalMinutes = gdprExportRateLimitIntervalMinutes;
  }

  @Positive
  public int getGdprExportRateLimitCapacity() {
    return gdprExportRateLimitCapacity;
  }

  public void setGdprExportRateLimitCapacity(@Positive int gdprExportRateLimitCapacity) {
    this.gdprExportRateLimitCapacity = gdprExportRateLimitCapacity;
  }
}
