/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.filter;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RepoIntegerValueFilter(
    @NotNull @Valid RepoAttributeSelection attribute,
    @NotNull Integer value,
    @NotNull RepoNumericComparison numericComparison,
    @NotNull boolean withNullValues)
    implements RepoFilter {
  static final String SCHEMA_NAME = "RepoIntegerValueFilter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
