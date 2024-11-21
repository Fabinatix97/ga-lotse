/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.chartconfiguration;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RepoScatterChart(
    @NotNull @Valid RepoAttributeSelection xAttribute,
    @NotNull @Valid RepoAttributeSelection yAttribute,
    @Valid RepoAttributeSelection secondaryAttribute,
    @NotBlank String range,
    @NotNull boolean trendLine)
    implements RepoChartConfiguration {
  public static final String SCHEMA_NAME = "RepoScatterChart";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
