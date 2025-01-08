/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.lib.procedure.api.TaskListApi.QueryParameter;
import jakarta.validation.constraints.NotNull;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetTasksSortOptions(
    @BindParam(QueryParameter.SORT_KEY) @NotNull GetTasksSortByDto sortKey,
    @BindParam(QueryParameter.SORT_ORDER) GetTasksSortOrderDto sortOrder) {

  public GetTasksSortOptions(GetTasksSortByDto sortKey, GetTasksSortOrderDto sortOrder) {
    this.sortKey = sortKey;
    this.sortOrder = Objects.requireNonNullElse(sortOrder, GetTasksSortOrderDto.ASC);
  }

  public static GetTasksSortOptions fromSortBy(GetTasksSortByDto sortBy) {
    return new GetTasksSortOptions(sortBy, null);
  }
}
