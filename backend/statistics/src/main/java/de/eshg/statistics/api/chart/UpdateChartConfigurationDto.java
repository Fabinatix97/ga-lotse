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

@Schema(name = "AbstractUpdateChartConfiguration")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = UpdateBarChartConfigurationDto.class,
      name = UpdateBarChartConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = UpdateChoroplethMapConfigurationDto.class,
      name = UpdateChoroplethMapConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = UpdateHistogramChartConfigurationDto.class,
      name = UpdateHistogramChartConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = UpdateLineChartConfigurationDto.class,
      name = UpdateLineChartConfigurationDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = UpdateScatterChartConfigurationDto.class,
      name = UpdateScatterChartConfigurationDto.SCHEMA_NAME),
})
public sealed interface UpdateChartConfigurationDto
    permits UpdateBarChartConfigurationDto,
        UpdateChoroplethMapConfigurationDto,
        UpdateHistogramChartConfigurationDto,
        UpdateLineChartConfigurationDto,
        UpdateScatterChartConfigurationDto {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
