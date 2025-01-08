/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PAGE_NUMBER;
import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PAGE_SIZE;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetProceduresPaginationOptions(
    @Parameter(description = "Limit of returned procedures")
        @BindParam(value = PAGE_SIZE)
        @Schema(defaultValue = "50")
        @Min(1)
        @Max(200)
        Integer pageSize,
    @Parameter(description = "Offset used for pagination")
        @BindParam(value = PAGE_NUMBER)
        @Schema(defaultValue = "0")
        @Min(0)
        @Max(2000)
        Integer pageNumber) {

  public GetProceduresPaginationOptions(Integer pageSize, Integer pageNumber) {
    this.pageSize = Objects.requireNonNullElse(pageSize, 50);
    this.pageNumber = Objects.requireNonNullElse(pageNumber, 0);
  }
}
