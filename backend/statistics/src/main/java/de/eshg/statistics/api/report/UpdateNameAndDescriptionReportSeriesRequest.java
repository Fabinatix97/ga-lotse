/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import static de.eshg.statistics.api.report.UpdateNameAndDescriptionReportSeriesRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = SCHEMA_NAME)
public record UpdateNameAndDescriptionReportSeriesRequest(@NotBlank String name, String description)
    implements AbstractUpdateReportSeriesRequest {
  public static final String SCHEMA_NAME = "UpdateNameAndDescriptionReportSeriesRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
