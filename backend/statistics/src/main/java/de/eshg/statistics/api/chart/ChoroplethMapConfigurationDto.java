/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import static de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto.SCHEMA_NAME;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record ChoroplethMapConfigurationDto(
    @NotNull @Valid AttributeSelectionDto primaryAttribute,
    @Valid AttributeSelectionDto secondaryAttribute,
    CalculationDto calculation,
    String geoJson,
    @NotBlank String colorScheme)
    implements ChartConfigurationDto {
  public static final String SCHEMA_NAME = "ChoroplethMapConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
