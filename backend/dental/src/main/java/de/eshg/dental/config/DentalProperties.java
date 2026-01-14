/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.config;

import de.eshg.testhelper.ResettableProperties;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.dental")
public class DentalProperties implements ResettableProperties {

  private @NotNull Integer maxNumberOfImportRows = 10_000;

  public Integer getMaxNumberOfImportRows() {
    return maxNumberOfImportRows;
  }

  public void setMaxNumberOfImportRows(Integer maxNumberOfImportRows) {
    this.maxNumberOfImportRows = maxNumberOfImportRows;
  }
}
