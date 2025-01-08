/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.InboxProcedureApi.QueryParameter.*;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetInboxProceduresPaginationOptions(
    @Parameter(description = "Number of the requested page")
        @BindParam(value = PAGE_NUMBER)
        @Schema(defaultValue = "0")
        @PositiveOrZero
        Integer pageNumber,
    @Parameter(description = "Amount of requested inbox procedures")
        @BindParam(value = PAGE_SIZE)
        @Schema(defaultValue = DEFAULT_PAGE_SIZE)
        @Min(1)
        @Max(200)
        Integer pageSize) {

  public GetInboxProceduresPaginationOptions(Integer pageNumber, Integer pageSize) {
    this.pageSize = Objects.requireNonNullElse(pageSize, DEFAULT_PAGE_SIZE_VALUE);
    this.pageNumber = Objects.requireNonNullElse(pageNumber, 0);
  }
}
