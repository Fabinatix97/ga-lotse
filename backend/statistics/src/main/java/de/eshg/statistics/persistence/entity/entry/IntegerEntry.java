/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.entry;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@DataSensitivity(SENSITIVE)
@Entity
@DiscriminatorValue("INTEGER_ENTRY")
public class IntegerEntry extends CellEntry {
  @Column private Integer integerValue;

  @Column private Integer integerLowerBound;

  @Column private Integer integerUpperBound;

  public Integer getIntegerValue() {
    return integerValue;
  }

  public void setIntegerValue(Integer integerValue) {
    this.integerValue = integerValue;
  }

  public Integer getIntegerLowerBound() {
    return integerLowerBound;
  }

  public void setIntegerLowerBound(Integer integerLowerBound) {
    this.integerLowerBound = integerLowerBound;
  }

  public Integer getIntegerUpperBound() {
    return integerUpperBound;
  }

  public void setIntegerUpperBound(Integer integerUpperBound) {
    this.integerUpperBound = integerUpperBound;
  }

  @Override
  public Object getValue() {
    if (getIntegerValue() == null) {
      return null;
    }
    if (getTableColumn().getValueType().equals(TableColumnValueType.INTEGER)) {
      return getIntegerValue();
    } else {
      return FilterParameterMapper.INTERVAL_FORMAT_STRING.formatted(
          getIntegerLowerBound(), getIntegerUpperBound());
    }
  }
}
