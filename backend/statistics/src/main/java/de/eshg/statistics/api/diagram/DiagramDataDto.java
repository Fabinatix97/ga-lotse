/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "DiagramData")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(value = BarChartDataDto.class, name = BarChartDataDto.SCHEMA_NAME),
  @JsonSubTypes.Type(value = ChoroplethMapDataDto.class, name = ChoroplethMapDataDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = HistogramChartDataCategorizedDto.class,
      name = HistogramChartDataCategorizedDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = HistogramChartDataSimpleDto.class,
      name = HistogramChartDataSimpleDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = LineChartDataCategorizedDto.class,
      name = LineChartDataCategorizedDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = LineChartDataSimpleDto.class,
      name = LineChartDataSimpleDto.SCHEMA_NAME),
  @JsonSubTypes.Type(value = PieChartDataDto.class, name = PieChartDataDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = ScatterChartDataCategorizedDto.class,
      name = ScatterChartDataCategorizedDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = ScatterChartDataSimpleDto.class,
      name = ScatterChartDataSimpleDto.SCHEMA_NAME)
})
public sealed interface DiagramDataDto
    permits BarChartDataDto,
        ChoroplethMapDataDto,
        HistogramChartDataCategorizedDto,
        HistogramChartDataSimpleDto,
        LineChartDataCategorizedDto,
        LineChartDataSimpleDto,
        PieChartDataDto,
        ScatterChartDataCategorizedDto,
        ScatterChartDataSimpleDto {

  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
