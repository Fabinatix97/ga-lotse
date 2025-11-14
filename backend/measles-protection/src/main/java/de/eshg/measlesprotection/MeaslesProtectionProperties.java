/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.measlesprotection")
public class MeaslesProtectionProperties {

  @DurationUnit(ChronoUnit.MINUTES)
  private Duration directVaccinationCheckRefreshThreshold = Duration.ofMinutes(10);

  public Duration getDirectVaccinationCheckCooldown() {
    return directVaccinationCheckRefreshThreshold;
  }

  public void setDirectVaccinationCheckRefreshThreshold(
      Duration directVaccinationCheckRefreshThreshold) {
    this.directVaccinationCheckRefreshThreshold = directVaccinationCheckRefreshThreshold;
  }
}
