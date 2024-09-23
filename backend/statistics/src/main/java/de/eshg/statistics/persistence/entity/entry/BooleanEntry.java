/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.entry;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.CellEntry;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@DataSensitivity(SENSITIVE)
@Entity
@DiscriminatorValue("BOOLEAN_ENTRY")
public class BooleanEntry extends CellEntry {
  @Column private Boolean boolValue;

  public Boolean getBoolValue() {
    return boolValue;
  }

  public void setBoolValue(Boolean boolValue) {
    this.boolValue = boolValue;
  }

  @Override
  public Object getValue() {
    return getBoolValue();
  }
}
