/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetStiProtectionProceduresSortOptions(
    @BindParam("sortBy") @Schema(defaultValue = "CREATED_AT")
        GetStiProtectionProceduresSortByDto sortBy,
    @BindParam("sortOrder") @Schema(defaultValue = "ASC")
        GetStiProtectionProceduresSortOrderDto sortOrder) {
  public GetStiProtectionProceduresSortOptions(
      GetStiProtectionProceduresSortByDto sortBy,
      GetStiProtectionProceduresSortOrderDto sortOrder) {
    this.sortBy =
        Objects.requireNonNullElse(sortBy, GetStiProtectionProceduresSortByDto.CREATED_AT);
    this.sortOrder =
        Objects.requireNonNullElse(sortOrder, GetStiProtectionProceduresSortOrderDto.ASC);
  }
}
