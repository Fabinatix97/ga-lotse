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
import java.math.BigDecimal;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("DECIMAL_RANGE_FILTER")
public class DecimalRangeFilterParameter extends AbstractFilterParameter {

  @Column(precision = 10, scale = 4, nullable = false)
  private BigDecimal minValueInclusive;

  @Column(precision = 10, scale = 4, nullable = false)
  private BigDecimal maxValueInclusive;

  @Column(nullable = false)
  private boolean withNullValues;

  public BigDecimal getMinValueInclusive() {
    return minValueInclusive;
  }

  public void setMinValueInclusive(BigDecimal minValueInclusive) {
    this.minValueInclusive = minValueInclusive;
  }

  public BigDecimal getMaxValueInclusive() {
    return maxValueInclusive;
  }

  public void setMaxValueInclusive(BigDecimal maxValueInclusive) {
    this.maxValueInclusive = maxValueInclusive;
  }

  public boolean isWithNullValues() {
    return withNullValues;
  }

  public void setWithNullValues(boolean withNullValues) {
    this.withNullValues = withNullValues;
  }
}
