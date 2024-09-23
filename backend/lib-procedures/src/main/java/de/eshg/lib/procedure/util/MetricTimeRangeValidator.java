/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.util;

import de.eshg.lib.procedure.api.ProcedureMetricsApi;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class MetricTimeRangeValidator {
  private MetricTimeRangeValidator() {}

  public static void validateTimeRange(Instant timeRangeStart, Instant timeRangeEnd) {
    if (timeRangeStart.isAfter(timeRangeEnd)) {
      throw new BadRequestException("End before start");
    }
    long days = ChronoUnit.DAYS.between(timeRangeStart, timeRangeEnd);
    if (days > ProcedureMetricsApi.MAXIMUM_DAYS_METRICS) {
      String errorMessage =
          "Too many days between start and end, maximum is %s"
              .formatted(ProcedureMetricsApi.MAXIMUM_DAYS_METRICS);
      throw new BadRequestException(errorMessage);
    }
  }
}
