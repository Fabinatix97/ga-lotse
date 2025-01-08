/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import static de.eshg.statistics.api.diagram.HistogramChartDataSimpleDto.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record HistogramChartDataSimpleDto(
    @NotNull @Valid List<HistogramGroupDataSimpleDto> histogramGroupDatas)
    implements DiagramDataDto {
  public static final String SCHEMA_NAME = "HistogramChartDataSimple";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
