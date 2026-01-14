/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import static de.eshg.statistics.api.chart.PieChartConfigurationDto.SCHEMA_NAME;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record PieChartConfigurationDto(@NotNull @Valid AttributeSelectionDto attribute)
    implements AddChartConfigurationDto, ChartConfigurationDto {
  public static final String SCHEMA_NAME = "PieChartConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
