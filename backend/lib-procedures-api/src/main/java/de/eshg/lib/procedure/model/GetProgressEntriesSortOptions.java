/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ProgressEntryApi.QueryParameter.SORT_BY;
import static de.eshg.lib.procedure.api.ProgressEntryApi.QueryParameter.SORT_ORDER;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetProgressEntriesSortOptions(
    @CanBeLogged
        @Parameter(description = "Sorting on either modifiedAt or createdAt ")
        @BindParam(SORT_BY)
        ProgressEntrySortByDto sortBy,
    @CanBeLogged
        @Parameter(
            description =
                "Sorting order. Possible options  \"ASC\" for ascending and \"DESC\" for descending.")
        @BindParam(SORT_ORDER)
        ProgressEntrySortOrderDto sortOrder) {
  public GetProgressEntriesSortOptions(
      ProgressEntrySortByDto sortBy, ProgressEntrySortOrderDto sortOrder) {
    this.sortBy = Objects.requireNonNullElse(sortBy, ProgressEntrySortByDto.CREATED_AT);
    this.sortOrder = Objects.requireNonNullElse(sortOrder, ProgressEntrySortOrderDto.ASC);
  }
}
