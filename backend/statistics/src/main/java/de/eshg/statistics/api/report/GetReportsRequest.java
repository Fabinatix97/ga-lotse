/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import de.eshg.base.SortDirection;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import java.util.Optional;

public record GetReportsRequest(
    @Schema(defaultValue = "DESC") SortDirection sortDirection,
    @Min(0) @Schema(defaultValue = "0") Integer page,
    @Min(1) @Schema(defaultValue = "25") Integer pageSize,
    ReportTypeDto reportTypeFilter) {

  public GetReportsRequest(
      SortDirection sortDirection, Integer page, Integer pageSize, ReportTypeDto reportTypeFilter) {
    this.sortDirection = Optional.ofNullable(sortDirection).orElse(SortDirection.DESC);
    this.page = Optional.ofNullable(page).orElse(0);
    this.pageSize = Optional.ofNullable(pageSize).orElse(25);
    this.reportTypeFilter = reportTypeFilter;
  }
}
