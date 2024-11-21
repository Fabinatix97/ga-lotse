/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.chartconfiguration;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RepoHistogramChart(
    @NotNull @Valid RepoAttributeSelection primaryAttribute,
    @Valid RepoAttributeSelection secondaryAttribute,
    String scaling,
    String grouping,
    @NotBlank String binningMode,
    @Min(2) @Max(50) Integer numberOfBins)
    implements RepoChartConfiguration {
  public static final String SCHEMA_NAME = "RepoHistogramChart";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
