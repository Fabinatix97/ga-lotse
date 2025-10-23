/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import de.eshg.api.commons.SortDirection;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import java.util.Optional;

public record GetReportsRequest(
    @Schema(defaultValue = "DESC") SortDirection sortDirection,
    @Min(0) @Schema(defaultValue = "0") Integer page,
    @Min(1) @Schema(defaultValue = "25") Integer pageSize,
    @Valid GetReportsFilterOptions filterOptions) {

  public GetReportsRequest(
      SortDirection sortDirection,
      Integer page,
      Integer pageSize,
      GetReportsFilterOptions filterOptions) {
    this.sortDirection = Optional.ofNullable(sortDirection).orElse(SortDirection.DESC);
    this.page = Optional.ofNullable(page).orElse(0);
    this.pageSize = Optional.ofNullable(pageSize).orElse(25);
    this.filterOptions = filterOptions;
  }
}
