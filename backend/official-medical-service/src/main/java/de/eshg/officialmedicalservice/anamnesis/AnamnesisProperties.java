/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.anamnesis;

import de.eshg.testhelper.ResettableProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.official-medical-service.anamnesis")
public class AnamnesisProperties implements ResettableProperties {

  private boolean anamnesisEnabled = true;

  public boolean isAnamnesisEnabled() {
    return anamnesisEnabled;
  }

  public void setAnamnesisEnabled(boolean anamnesisEnabled) {
    this.anamnesisEnabled = anamnesisEnabled;
  }
}
