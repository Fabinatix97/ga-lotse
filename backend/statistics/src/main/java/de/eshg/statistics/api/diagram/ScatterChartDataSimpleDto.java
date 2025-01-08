/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import static de.eshg.statistics.api.diagram.ScatterChartDataSimpleDto.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record ScatterChartDataSimpleDto(
    @NotNull @Valid List<DataPointDto> dataPoints, @Valid TrendLineDto trendLine)
    implements DiagramDataDto {
  public static final String SCHEMA_NAME = "ScatterChartDataSimple";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
