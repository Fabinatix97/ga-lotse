/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.cemetery;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("de.eshg.lib.procedure.cemetery")
public class CemeteryProperties {

  @NotNull @Positive private int defaultRetentionTimeDays = 365;

  public int getDefaultRetentionTimeDays() {
    return defaultRetentionTimeDays;
  }

  public void setDefaultRetentionTimeDays(int defaultRetentionTimeDays) {
    this.defaultRetentionTimeDays = defaultRetentionTimeDays;
  }
}
