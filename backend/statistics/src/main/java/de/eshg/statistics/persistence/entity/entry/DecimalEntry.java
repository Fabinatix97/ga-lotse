/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.entry;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@DataSensitivity(SENSITIVE)
@Entity
@DiscriminatorValue("DECIMAL_ENTRY")
public class DecimalEntry extends CellEntry {
  @Column(precision = 10, scale = 4)
  private BigDecimal bigDecimalValue;

  @Column(precision = 10, scale = 4)
  private BigDecimal decimalLowerBound;

  @Column(precision = 10, scale = 4)
  private BigDecimal decimalUpperBound;

  public BigDecimal getBigDecimalValue() {
    return bigDecimalValue;
  }

  public void setBigDecimalValue(BigDecimal bigDecimalValue) {
    this.bigDecimalValue = bigDecimalValue;
  }

  public BigDecimal getDecimalLowerBound() {
    return decimalLowerBound;
  }

  public void setDecimalLowerBound(BigDecimal decimalLowerBound) {
    this.decimalLowerBound = decimalLowerBound;
  }

  public BigDecimal getDecimalUpperBound() {
    return decimalUpperBound;
  }

  public void setDecimalUpperBound(BigDecimal decimalUpperBound) {
    this.decimalUpperBound = decimalUpperBound;
  }

  @Override
  public Object getValue() {
    if (getBigDecimalValue() == null) {
      return null;
    }
    if (getTableColumn().getValueType().equals(TableColumnValueType.DECIMAL)) {
      return getBigDecimalValue().doubleValue();
    } else {
      return "[%s;%s]"
          .formatted(getAsString(getDecimalLowerBound()), getAsString(getDecimalUpperBound()));
    }
  }

  private static String getAsString(BigDecimal decimal) {
    NumberFormat numberFormat = NumberFormat.getInstance(Locale.GERMAN);
    numberFormat.setGroupingUsed(false);
    numberFormat.setMaximumFractionDigits(4);
    return numberFormat.format(decimal.doubleValue());
  }
}
