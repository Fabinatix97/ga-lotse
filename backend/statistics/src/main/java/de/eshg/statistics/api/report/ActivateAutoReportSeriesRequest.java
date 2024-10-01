/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import static de.eshg.statistics.api.report.ActivateAutoReportSeriesRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record ActivateAutoReportSeriesRequest(
    @Min(1) @Max(12) @NotNull Integer startMonth,
    @NotNull FrequencyDto frequency,
    @NotNull ReportingPeriodDto reportingPeriod)
    implements AbstractUpdateReportSeriesRequest {
  public static final String SCHEMA_NAME = "ActivateAutoReportSeriesRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
