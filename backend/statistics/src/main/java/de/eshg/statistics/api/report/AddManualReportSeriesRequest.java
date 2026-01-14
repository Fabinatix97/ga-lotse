/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import static de.eshg.statistics.api.report.AddManualReportSeriesRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
public record AddManualReportSeriesRequest(
    @NotNull UUID evaluationId,
    @NotBlank String name,
    String description,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd)
    implements AbstractAddReportSeriesRequest {
  public static final String SCHEMA_NAME = "AddManualReportSeriesRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
