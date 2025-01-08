/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.cemetery;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("de.eshg.lib.procedure.housekeeping.cemetery")
public class CemeteryHousekeepingProperties {

  @NotNull @Positive private int retentionTimeDays = 365;

  public int getRetentionTimeDays() {
    return retentionTimeDays;
  }

  public void setRetentionTimeDays(int retentionTimeDays) {
    this.retentionTimeDays = retentionTimeDays;
  }
}
