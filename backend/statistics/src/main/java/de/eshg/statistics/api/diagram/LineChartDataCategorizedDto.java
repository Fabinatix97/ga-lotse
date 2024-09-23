/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import static de.eshg.statistics.api.diagram.LineChartDataCategorizedDto.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record LineChartDataCategorizedDto(@NotNull @Valid List<DataPointGroupDto> dataPointGroups)
    implements DiagramDataDto {
  public static final String SCHEMA_NAME = "LineChartDataCategorized";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
