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
import java.math.BigDecimal;

@DataSensitivity(SENSITIVE)
@Entity
@DiscriminatorValue("DECIMAL_ENTRY")
public class DecimalEntry extends CellEntry {
  @Column(precision = 10, scale = 4)
  private BigDecimal bigDecimalValue;

  public BigDecimal getBigDecimalValue() {
    return bigDecimalValue;
  }

  public void setBigDecimalValue(BigDecimal bigDecimalValue) {
    this.bigDecimalValue = bigDecimalValue;
  }

  @Override
  public Object getValue() {
    return getBigDecimalValue() == null ? null : getBigDecimalValue().doubleValue();
  }
}
