/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetMedsAbroadProceduresSortOptions(
    @BindParam("sortBy") @Schema(defaultValue = "CREATED_AT")
        GetMedsAbroadProceduresSortByDto sortBy,
    @BindParam("sortOrder") @Schema(defaultValue = "DESC")
        GetMedsAbroadProceduresSortOrderDto sortOrder) {
  public GetMedsAbroadProceduresSortOptions(
      GetMedsAbroadProceduresSortByDto sortBy, GetMedsAbroadProceduresSortOrderDto sortOrder) {
    this.sortBy = Objects.requireNonNullElse(sortBy, GetMedsAbroadProceduresSortByDto.CREATED_AT);
    this.sortOrder =
        Objects.requireNonNullElse(sortOrder, GetMedsAbroadProceduresSortOrderDto.DESC);
  }
}
