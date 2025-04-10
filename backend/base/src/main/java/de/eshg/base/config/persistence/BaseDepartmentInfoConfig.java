/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.persistence;

import de.eshg.config.domain.AbstractDepartmentInfoConfig;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.AssociationOverride;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;

@Entity
@AssociationOverride(name = "departmentInfo", joinColumns = @JoinColumn(nullable = false))
public class BaseDepartmentInfoConfig extends AbstractDepartmentInfoConfig {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean initialized = true;

  public boolean isInitialized() {
    return initialized;
  }

  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }
}
