/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import static de.eshg.statistics.api.report.AddAutoReportSeriesRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
public record AddAutoReportSeriesRequest(
    @NotNull UUID statisticId,
    @NotBlank String name,
    String description,
    @Min(1) @Max(12) @NotNull int startMonth,
    @NotNull FrequencyDto frequency,
    @NotNull ReportingPeriodDto reportingPeriod)
    implements AbstractAddReportSeriesRequest {
  public static final String SCHEMA_NAME = "AddAutoReportSeriesRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
