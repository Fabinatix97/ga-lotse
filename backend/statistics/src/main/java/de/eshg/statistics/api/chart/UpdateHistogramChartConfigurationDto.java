/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import static de.eshg.statistics.api.chart.UpdateHistogramChartConfigurationDto.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = SCHEMA_NAME)
public record UpdateHistogramChartConfigurationDto(ScalingDto scaling, GroupingDto grouping)
    implements UpdateChartConfigurationDto {
  public static final String SCHEMA_NAME = "UpdateHistogramChartConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
