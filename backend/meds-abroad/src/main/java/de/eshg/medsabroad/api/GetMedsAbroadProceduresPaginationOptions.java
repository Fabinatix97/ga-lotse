/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetMedsAbroadProceduresPaginationOptions(
    @Parameter(description = "The page to be returned")
        @BindParam(value = "pageNumber")
        @Schema(defaultValue = DEFAULT_PAGE_NUMBER)
        @PositiveOrZero
        Integer pageNumber,
    @Parameter(description = "The number of items to be returned")
        @BindParam(value = "pageSize")
        @Schema(defaultValue = DEFAULT_PAGE_SIZE)
        @Min(1)
        @Max(200)
        Integer pageSize) {
  private static final String DEFAULT_PAGE_NUMBER = "0";
  public static final Integer DEFAULT_PAGE_NUMBER_VALUE = Integer.valueOf(DEFAULT_PAGE_NUMBER);
  private static final String DEFAULT_PAGE_SIZE = "25";
  public static final Integer DEFAULT_PAGE_SIZE_VALUE = Integer.valueOf(DEFAULT_PAGE_SIZE);

  public GetMedsAbroadProceduresPaginationOptions(Integer pageNumber, Integer pageSize) {
    this.pageSize = Objects.requireNonNullElse(pageSize, DEFAULT_PAGE_SIZE_VALUE);
    this.pageNumber = Objects.requireNonNullElse(pageNumber, DEFAULT_PAGE_NUMBER_VALUE);
  }
}
