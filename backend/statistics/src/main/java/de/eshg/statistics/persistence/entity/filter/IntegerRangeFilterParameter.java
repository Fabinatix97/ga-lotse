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

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("INTEGER_RANGE_FILTER")
public class IntegerRangeFilterParameter extends AbstractFilterParameter {

  @Column(nullable = false)
  private int minValueInclusive;

  @Column(nullable = false)
  private int maxValueInclusive;

  @Column(nullable = false)
  private boolean withNullValues;

  public int getMinValueInclusive() {
    return minValueInclusive;
  }

  public void setMinValueInclusive(int minValueInclusive) {
    this.minValueInclusive = minValueInclusive;
  }

  public int getMaxValueInclusive() {
    return maxValueInclusive;
  }

  public void setMaxValueInclusive(int maxValueInclusive) {
    this.maxValueInclusive = maxValueInclusive;
  }

  public boolean isWithNullValues() {
    return withNullValues;
  }

  public void setWithNullValues(boolean withNullValues) {
    this.withNullValues = withNullValues;
  }
}
