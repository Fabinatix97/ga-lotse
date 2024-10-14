/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.statistics.api.TimeRange;
import de.eshg.statistics.api.ValidTimeRange;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TimeRangeValidator implements ConstraintValidator<ValidTimeRange, TimeRange> {
  @Override
  @SuppressWarnings("java:S2589")
  public boolean isValid(
      TimeRange timeRange, ConstraintValidatorContext constraintValidatorContext) {
    if (timeRange == null || timeRange.start() == null || timeRange.end() == null) {
      return true;
    }
    return timeRange.start().isBefore(timeRange.end());
  }
}
