/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ArchivingApi.QueryParameter.SORT_BY;
import static de.eshg.lib.procedure.api.ArchivingApi.QueryParameter.SORT_ORDER;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetRelevantArchivableProceduresSortOptions(
    @Parameter(
            description =
                """
        The following sorting options are available:
        - `CLOSED_AT`: Sorting by closedAt attribute
        - `EXPORTED_AT`: Sorting by exportedAt attribute
        """)
        @BindParam(SORT_BY)
        @Schema(defaultValue = "CLOSED_AT")
        GetRelevantArchivableProceduresSortByDto sortBy,
    @Parameter(description = "Sorting order.") @BindParam(SORT_ORDER) @Schema(defaultValue = "ASC")
        GetRelevantArchivableProceduresSortOrderDto sortOrder) {

  public GetRelevantArchivableProceduresSortOptions(
      GetRelevantArchivableProceduresSortByDto sortBy,
      GetRelevantArchivableProceduresSortOrderDto sortOrder) {
    this.sortBy =
        Objects.requireNonNullElse(sortBy, GetRelevantArchivableProceduresSortByDto.CLOSED_AT);
    this.sortOrder =
        Objects.requireNonNullElse(sortOrder, GetRelevantArchivableProceduresSortOrderDto.ASC);
  }
}
