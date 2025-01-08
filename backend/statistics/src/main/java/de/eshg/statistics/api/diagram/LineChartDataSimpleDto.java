/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import static de.eshg.statistics.api.diagram.LineChartDataSimpleDto.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record LineChartDataSimpleDto(@NotNull @Valid List<DataPointDto> dataPoints)
    implements DiagramDataDto {
  public static final String SCHEMA_NAME = "LineChartDataSimple";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
