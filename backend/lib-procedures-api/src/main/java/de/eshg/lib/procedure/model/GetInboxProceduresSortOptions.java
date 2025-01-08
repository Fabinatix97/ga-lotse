/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.InboxProcedureApi.QueryParameter.SORT_BY;
import static de.eshg.lib.procedure.api.InboxProcedureApi.QueryParameter.SORT_ORDER;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetInboxProceduresSortOptions(
    @Parameter(
            description =
                """
        The following sorting options are available:
        - `CREATED_AT`: Sorting by createdAt attribute
        - `MODIFIED_AT`: Sorting by modifiedAt attribute
        """)
        @BindParam(SORT_BY)
        @Schema(defaultValue = "CREATED_AT")
        GetInboxProceduresSortByDto sortBy,
    @Parameter(description = "Sorting order.") @BindParam(SORT_ORDER) @Schema(defaultValue = "ASC")
        GetInboxProceduresSortOrderDto sortOrder) {

  public GetInboxProceduresSortOptions(
      GetInboxProceduresSortByDto sortBy, GetInboxProceduresSortOrderDto sortOrder) {
    this.sortBy = Objects.requireNonNullElse(sortBy, GetInboxProceduresSortByDto.CREATED_AT);
    this.sortOrder = Objects.requireNonNullElse(sortOrder, GetInboxProceduresSortOrderDto.ASC);
  }
}
