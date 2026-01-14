/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.filter;

import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RepoTextFilter(@NotNull @Valid RepoAttributeSelection attribute, @NotNull String text)
    implements RepoFilter {
  static final String SCHEMA_NAME = "RepoTextFilter";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
