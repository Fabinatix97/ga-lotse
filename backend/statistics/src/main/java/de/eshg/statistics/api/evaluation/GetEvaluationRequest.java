/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import de.eshg.api.commons.SortDirection;
import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import java.util.List;
import java.util.Optional;

public record GetEvaluationRequest(
    @Valid AttributeSelectionDto sortAttribute,
    @Schema(defaultValue = "ASC") SortDirection sortDirection,
    @Min(0) @Schema(defaultValue = "0") Integer page,
    @Min(1) @Schema(defaultValue = "25") Integer pageSize,
    @Valid List<TableColumnFilterParameter> filters) {

  public GetEvaluationRequest(
      AttributeSelectionDto sortAttribute,
      SortDirection sortDirection,
      Integer page,
      Integer pageSize,
      List<TableColumnFilterParameter> filters) {
    this.sortAttribute = sortAttribute;
    this.sortDirection = Optional.ofNullable(sortDirection).orElse(SortDirection.ASC);
    this.page = Optional.ofNullable(page).orElse(0);
    this.pageSize = Optional.ofNullable(pageSize).orElse(25);
    this.filters = filters;
  }
}
