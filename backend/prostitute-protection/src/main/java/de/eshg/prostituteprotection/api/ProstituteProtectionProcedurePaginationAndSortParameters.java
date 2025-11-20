/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PAGE_NUMBER;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PAGE_SIZE;

import de.eshg.api.commons.PaginationParameters;
import de.eshg.api.commons.SortDirection;
import de.eshg.api.commons.SortParameters;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record ProstituteProtectionProcedurePaginationAndSortParameters(
    @Schema(defaultValue = "ALIAS") ProstitutionProtectionProcedureSortKey sortKey,
    @Schema(defaultValue = "ASC") SortDirection sortDirection,
    @Parameter(description = "Offset used for pagination")
        @BindParam(value = PAGE_NUMBER)
        @Schema(defaultValue = "0")
        @Min(0)
        @Max(2000)
        Integer pageNumber,
    @Parameter(description = "Limit of returned procedures")
        @BindParam(value = PAGE_SIZE)
        @Schema(defaultValue = "25")
        @Min(1)
        @Max(200)
        Integer pageSize)
    implements PaginationParameters, SortParameters<ProstitutionProtectionProcedureSortKey> {
  public ProstituteProtectionProcedurePaginationAndSortParameters(
      ProstitutionProtectionProcedureSortKey sortKey,
      SortDirection sortDirection,
      Integer pageNumber,
      Integer pageSize) {
    this.sortKey =
        Objects.requireNonNullElse(sortKey, ProstitutionProtectionProcedureSortKey.ALIAS);
    this.sortDirection = Objects.requireNonNullElse(sortDirection, SortDirection.ASC);
    this.pageNumber = Objects.requireNonNullElse(pageNumber, 0);
    this.pageSize = Objects.requireNonNullElse(pageSize, 25);
  }
}
