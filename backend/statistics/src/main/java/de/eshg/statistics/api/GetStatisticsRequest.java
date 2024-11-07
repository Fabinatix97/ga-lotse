/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.base.SortDirection;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Optional;

public record GetStatisticsRequest(
    @Schema(defaultValue = "CREATED_AT") StatisticSortKey sortKey,
    @Schema(defaultValue = "DESC") SortDirection sortDirection,
    @Min(0) @Schema(defaultValue = "0") Integer page,
    @Min(1) @Max(200) @Schema(defaultValue = "25") Integer pageSize,
    Boolean anonymizationValue) {

  public GetStatisticsRequest(
      StatisticSortKey sortKey,
      SortDirection sortDirection,
      Integer page,
      Integer pageSize,
      Boolean anonymizationValue) {
    this.sortKey = Optional.ofNullable(sortKey).orElse(StatisticSortKey.CREATED_AT);
    this.sortDirection = Optional.ofNullable(sortDirection).orElse(SortDirection.DESC);
    this.page = Optional.ofNullable(page).orElse(0);
    this.pageSize = Optional.ofNullable(pageSize).orElse(25);
    this.anonymizationValue = anonymizationValue;
  }
}
