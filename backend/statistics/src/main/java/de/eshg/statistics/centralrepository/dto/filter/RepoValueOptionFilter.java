/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.filter;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record RepoValueOptionFilter(
    @NotNull @Valid RepoAttributeSelection attribute,
    @NotNull List<String> searchValues,
    @NotNull boolean searchForNull)
    implements RepoFilter {
  static final String SCHEMA_NAME = "RepoValueOptionFilter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
