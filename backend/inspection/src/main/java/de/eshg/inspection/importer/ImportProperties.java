/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import de.eshg.testhelper.ResettableProperties;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.inspection.import")
public class ImportProperties implements ResettableProperties {

  private @NotNull Integer maxNumberOfImportRows = 1000;

  public Integer getMaxNumberOfImportRows() {
    return maxNumberOfImportRows;
  }

  public void setMaxNumberOfImportRows(Integer maxNumberOfImportRows) {
    this.maxNumberOfImportRows = maxNumberOfImportRows;
  }
}
