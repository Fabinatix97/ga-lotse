/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.chartconfiguration;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RepoBarChart(
    @NotNull @Valid RepoAttributeSelection primaryAttribute,
    @Valid RepoAttributeSelection secondaryAttribute,
    String scaling,
    String grouping,
    @NotBlank String orientation)
    implements RepoChartConfiguration {
  public static final String SCHEMA_NAME = "RepoBarChart";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
