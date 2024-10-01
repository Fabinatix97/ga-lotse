/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import static de.eshg.statistics.api.report.DeactivateAutoReportSeriesRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = SCHEMA_NAME)
public record DeactivateAutoReportSeriesRequest() implements AbstractUpdateReportSeriesRequest {
  public static final String SCHEMA_NAME = "DeactivateAutoReportSeriesRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
