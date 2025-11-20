/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.testhelper.ResettableProperties;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.measlesprotection")
public class MeaslesProtectionProperties implements ResettableProperties {

  @DurationUnit(ChronoUnit.MINUTES)
  private Duration directVaccinationCheckCooldown = Duration.ofMinutes(10);

  private boolean polytuneActive = false;

  public Duration getDirectVaccinationCheckCooldown() {
    return directVaccinationCheckCooldown;
  }

  public void setDirectVaccinationCheckRefreshThreshold(Duration directVaccinationCheckCooldown) {
    this.directVaccinationCheckCooldown = directVaccinationCheckCooldown;
  }

  public boolean isPolytuneActive() {
    return polytuneActive;
  }

  public void setPolytuneActive(boolean polytuneActive) {
    this.polytuneActive = polytuneActive;
  }
}
