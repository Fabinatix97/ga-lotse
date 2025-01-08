/*
 * Copyright 2025 cronn GmbH
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
@DiscriminatorValue("INTEGER_ENTRY")
public class IntegerEntry extends CellEntry {
  @Column private Integer integerValue;

  public Integer getIntegerValue() {
    return integerValue;
  }

  public void setIntegerValue(Integer integerValue) {
    this.integerValue = integerValue;
  }

  @Override
  public Object getValue() {
    return getIntegerValue();
  }
}
