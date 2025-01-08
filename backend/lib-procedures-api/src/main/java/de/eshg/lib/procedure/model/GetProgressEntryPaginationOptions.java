/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.api.ProgressEntryApi.QueryParameter.PAGE_NUMBER;

import de.eshg.lib.procedure.api.ProgressEntryApi.QueryParameter;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetProgressEntryPaginationOptions(
    @Parameter(description = "Maximum number of elements to return")
        @BindParam(value = QueryParameter.PAGE_SIZE)
        @Schema(defaultValue = "50")
        @Min(1)
        @Max(200)
        Integer pageSize,
    @Parameter(description = "Index of page to be returned")
        @BindParam(value = PAGE_NUMBER)
        @Schema(defaultValue = "0")
        @PositiveOrZero
        Integer pageNumber) {

  public GetProgressEntryPaginationOptions(Integer pageSize, Integer pageNumber) {
    this.pageSize = Objects.requireNonNullElse(pageSize, 50);
    this.pageNumber = Objects.requireNonNullElse(pageNumber, 0);
  }
}
