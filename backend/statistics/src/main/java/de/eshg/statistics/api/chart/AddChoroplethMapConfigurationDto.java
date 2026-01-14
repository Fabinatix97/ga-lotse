/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import static de.eshg.statistics.api.chart.AddChoroplethMapConfigurationDto.SCHEMA_NAME;

import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
public record AddChoroplethMapConfigurationDto(
    @NotNull @Valid AttributeSelectionDto primaryAttribute,
    @Valid AttributeSelectionDto secondaryAttribute,
    CalculationDto calculation,
    @NotNull UUID geoShapeId,
    @NotBlank String colorScheme)
    implements AddChartConfigurationDto {
  public static final String SCHEMA_NAME = "AddChoroplethMapConfiguration";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
