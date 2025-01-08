/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.chartconfiguration;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.constraints.NotNull;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(value = RepoBarChart.class, name = RepoBarChart.SCHEMA_NAME),
  @JsonSubTypes.Type(value = RepoChoroplethMap.class, name = RepoChoroplethMap.SCHEMA_NAME),
  @JsonSubTypes.Type(value = RepoHistogramChart.class, name = RepoHistogramChart.SCHEMA_NAME),
  @JsonSubTypes.Type(value = RepoLineChart.class, name = RepoLineChart.SCHEMA_NAME),
  @JsonSubTypes.Type(value = RepoPieChart.class, name = RepoPieChart.SCHEMA_NAME),
  @JsonSubTypes.Type(value = RepoScatterChart.class, name = RepoScatterChart.SCHEMA_NAME),
})
public sealed interface RepoChartConfiguration
    permits RepoBarChart,
        RepoChoroplethMap,
        RepoHistogramChart,
        RepoLineChart,
        RepoPieChart,
        RepoScatterChart {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
