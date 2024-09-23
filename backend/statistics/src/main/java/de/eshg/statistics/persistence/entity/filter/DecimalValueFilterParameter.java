/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.filter;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.math.BigDecimal;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("DECIMAL_VALUE_FILTER")
public class DecimalValueFilterParameter extends AbstractFilterParameter {

  @Column(precision = 10, scale = 4, nullable = false)
  private BigDecimal value;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private NumericComparison numericComparison;

  @Column(nullable = false)
  private boolean withNullValues;

  public BigDecimal getValue() {
    return value;
  }

  public void setValue(BigDecimal value) {
    this.value = value;
  }

  public NumericComparison getNumericComparison() {
    return numericComparison;
  }

  public void setNumericComparison(NumericComparison numericComparison) {
    this.numericComparison = numericComparison;
  }

  public boolean isWithNullValues() {
    return withNullValues;
  }

  public void setWithNullValues(boolean withNullValues) {
    this.withNullValues = withNullValues;
  }
}
