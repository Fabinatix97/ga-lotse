/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.filter;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("INTEGER_VALUE_FILTER")
public class IntegerValueFilterParameter extends AbstractFilterParameter {

  @Column(nullable = false)
  private int value;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private NumericComparison numericComparison;

  @Column(nullable = false)
  private boolean withNullValues;

  public int getValue() {
    return value;
  }

  public void setValue(int value) {
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
