/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import static de.eshg.statistics.api.chart.HistogramChartConfigurationDto.SCHEMA_NAME;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(name = SCHEMA_NAME)
public record HistogramChartConfigurationDto(
    @NotNull @Valid AttributeSelectionDto primaryAttribute,
    @Valid AttributeSelectionDto secondaryAttribute,
    @NotNull ScalingDto scaling,
    GroupingDto grouping,
    @NotNull BinningModeDto binningMode,
    @Min(2) @Max(50) Integer numberOfBins,
    BigDecimal minBin,
    BigDecimal maxBin)
    implements AddChartConfigurationDto, ChartConfigurationDto {
  public static final String SCHEMA_NAME = "HistogramChartConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
