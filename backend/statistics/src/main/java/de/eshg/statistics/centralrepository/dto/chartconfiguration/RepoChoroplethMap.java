/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.chartconfiguration;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RepoChoroplethMap(
    @NotNull @Valid RepoAttributeSelection primaryAttribute,
    @Valid RepoAttributeSelection secondaryAttribute,
    String calculation,
    @NotBlank String geoJson,
    @NotBlank String colorScheme)
    implements RepoChartConfiguration {
  public static final String SCHEMA_NAME = "RepoChoroplethMap";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
