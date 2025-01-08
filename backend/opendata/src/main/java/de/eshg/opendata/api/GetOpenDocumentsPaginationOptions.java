/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Objects;
import org.springframework.web.bind.annotation.BindParam;

public record GetOpenDocumentsPaginationOptions(
    @Parameter(description = "Limit of returned results")
        @BindParam(value = PAGE_SIZE)
        @Schema(defaultValue = "25")
        @Min(1)
        @Max(200)
        Integer pageSize,
    @Parameter(description = "Offset used for pagination")
        @BindParam(value = PAGE_NUMBER)
        @Schema(defaultValue = "0")
        @Min(0)
        @Max(2000)
        Integer pageNumber) {

  private static final String PAGE_NUMBER = "pageNumber";
  private static final String PAGE_SIZE = "pageSize";

  public GetOpenDocumentsPaginationOptions() {
    this(null, null);
  }

  public GetOpenDocumentsPaginationOptions(Integer pageSize, Integer pageNumber) {
    this.pageSize = Objects.requireNonNullElse(pageSize, 25);
    this.pageNumber = Objects.requireNonNullElse(pageNumber, 0);
  }
}
