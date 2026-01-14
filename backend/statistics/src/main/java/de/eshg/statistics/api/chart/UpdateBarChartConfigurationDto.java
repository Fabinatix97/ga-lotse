/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import static de.eshg.statistics.api.chart.UpdateBarChartConfigurationDto.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = SCHEMA_NAME)
public record UpdateBarChartConfigurationDto(
    ScalingDto scaling, GroupingDto grouping, OrientationDto orientation)
    implements UpdateChartConfigurationDto {
  public static final String SCHEMA_NAME = "UpdateBarChartConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
