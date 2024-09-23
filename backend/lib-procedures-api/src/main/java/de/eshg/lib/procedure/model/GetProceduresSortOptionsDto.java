/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.SORT_BY;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.SORT_ORDER;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

@Schema(name = "GetProceduresSortOptions")
public record GetProceduresSortOptionsDto(
    @CanBeLogged
        @Parameter(
            description =
                """
        The following sorting options are available:
        - `CREATED_AT`: Sorting by createdAt attribute
        - `MODIFIED_AT`: Sorting by modifiedAt attribute
        """)
        @BindParam(SORT_BY)
        @Schema(defaultValue = "CREATED_AT")
        GetProceduresSortByDto sortBy,
    @CanBeLogged
        @Parameter(description = "Sorting order.")
        @BindParam(SORT_ORDER)
        @Schema(defaultValue = "ASC")
        GetProceduresSortOrderDto sortOrder) {

  public GetProceduresSortOptionsDto(
      GetProceduresSortByDto sortBy, GetProceduresSortOrderDto sortOrder) {
    this.sortBy = Objects.requireNonNullElse(sortBy, GetProceduresSortByDto.CREATED_AT);
    this.sortOrder = Objects.requireNonNullElse(sortOrder, GetProceduresSortOrderDto.ASC);
  }
}
