/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.filter;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RepoIntegerRangeFilter(
    @NotNull @Valid RepoAttributeSelection attribute,
    @NotNull Integer minValueInclusive,
    @NotNull Integer maxValueInclusive,
    @NotNull boolean withNullValues)
    implements RepoFilter {
  static final String SCHEMA_NAME = "RepoIntegerRangeFilter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
