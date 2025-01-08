/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.chartconfiguration;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RepoPieChart(@NotNull @Valid RepoAttributeSelection attribute)
    implements RepoChartConfiguration {
  public static final String SCHEMA_NAME = "RepoPieChart";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
