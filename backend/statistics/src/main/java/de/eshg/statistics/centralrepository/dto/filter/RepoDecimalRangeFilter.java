/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.filter;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record RepoDecimalRangeFilter(
    @NotNull @Valid RepoAttributeSelection attribute,
    @NotNull BigDecimal minValueInclusive,
    @NotNull BigDecimal maxValueInclusive,
    @NotNull boolean withNullValues)
    implements RepoFilter {
  static final String SCHEMA_NAME = "RepoDecimalRangeFilter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
