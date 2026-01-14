/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AbstractAddChartConfiguration")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = BarChartConfigurationDto.class,
      name = BarChartConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = AddChoroplethMapConfigurationDto.class,
      name = AddChoroplethMapConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = HistogramChartConfigurationDto.class,
      name = HistogramChartConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = LineChartConfigurationDto.class,
      name = LineChartConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = PieChartConfigurationDto.class,
      name = PieChartConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = ScatterChartConfigurationDto.class,
      name = ScatterChartConfigurationDto.SCHEMA_NAME),
})
public sealed interface AddChartConfigurationDto
    permits BarChartConfigurationDto,
        AddChoroplethMapConfigurationDto,
        HistogramChartConfigurationDto,
        LineChartConfigurationDto,
        PieChartConfigurationDto,
        ScatterChartConfigurationDto {

  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
