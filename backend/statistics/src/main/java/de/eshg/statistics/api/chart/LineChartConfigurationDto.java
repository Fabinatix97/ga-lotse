/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import static de.eshg.statistics.api.chart.LineChartConfigurationDto.SCHEMA_NAME;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record LineChartConfigurationDto(
    @NotNull @Valid AttributeSelectionDto xAttribute,
    @NotNull @Valid AttributeSelectionDto yAttribute,
    @Valid AttributeSelectionDto secondaryAttribute,
    @NotNull RangeDto range)
    implements AddChartConfigurationDto, ChartConfigurationDto, PointBasedChartConfigurationDto {
  public static final String SCHEMA_NAME = "LineChartConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
