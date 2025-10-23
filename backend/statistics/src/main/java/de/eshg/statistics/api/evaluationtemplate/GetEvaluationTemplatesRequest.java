/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import de.eshg.api.commons.SortDirection;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Optional;

public record GetEvaluationTemplatesRequest(
    @Schema(defaultValue = "CREATED_AT") EvaluationTemplateSortKey sortKey,
    @Schema(defaultValue = "DESC") SortDirection sortDirection,
    @Min(0) @Schema(defaultValue = "0") Integer page,
    @Min(1) @Max(200) @Schema(defaultValue = "25") Integer pageSize,
    @Valid GetEvaluationTemplatesFilterOptions filterOptions) {

  public GetEvaluationTemplatesRequest(
      EvaluationTemplateSortKey sortKey,
      SortDirection sortDirection,
      Integer page,
      Integer pageSize,
      GetEvaluationTemplatesFilterOptions filterOptions) {
    this.sortKey = Optional.ofNullable(sortKey).orElse(EvaluationTemplateSortKey.CREATED_AT);
    this.sortDirection = Optional.ofNullable(sortDirection).orElse(SortDirection.DESC);
    this.page = Optional.ofNullable(page).orElse(0);
    this.pageSize = Optional.ofNullable(pageSize).orElse(25);
    this.filterOptions = filterOptions;
  }
}
