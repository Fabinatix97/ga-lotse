/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.rest.service.error.BadRequestException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class TimeRangeValidator {
  private TimeRangeValidator() {}

  public static void validateTimeRange(
      Instant timeRangeStart, Instant timeRangeEnd, int maxTimeRangeInDays) {
    if (timeRangeStart.isAfter(timeRangeEnd)) {
      throw new BadRequestException("End before start");
    }
    long days = ChronoUnit.DAYS.between(timeRangeStart, timeRangeEnd);
    if (days > maxTimeRangeInDays) {
      String errorMessage =
          "Too many days between start and end, maximum is %s".formatted(maxTimeRangeInDays);
      throw new BadRequestException(errorMessage);
    }
  }
}
