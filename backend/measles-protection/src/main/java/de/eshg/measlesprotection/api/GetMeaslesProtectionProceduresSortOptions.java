/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetMeaslesProtectionProceduresSortOptions(
    @BindParam("sortBy") @Schema(defaultValue = "CREATED_AT")
        GetMeaslesProtectionProceduresSortByDto sortBy,
    @BindParam("sortOrder") @Schema(defaultValue = "DESC")
        GetMeaslesProtectionProceduresSortOrderDto sortOrder) {
  public GetMeaslesProtectionProceduresSortOptions(
      GetMeaslesProtectionProceduresSortByDto sortBy,
      GetMeaslesProtectionProceduresSortOrderDto sortOrder) {
    this.sortBy =
        Objects.requireNonNullElse(sortBy, GetMeaslesProtectionProceduresSortByDto.CREATED_AT);
    this.sortOrder =
        Objects.requireNonNullElse(sortOrder, GetMeaslesProtectionProceduresSortOrderDto.DESC);
  }
}
