/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(name = ImportStatisticsDto.SCHEMA_NAME)
public record ImportStatisticsDto(
    @NotNull @Min(0) int total,
    @NotNull @Min(0) int created,
    @NotNull @Min(0) int merged,
    @NotNull @Min(0) int mergeFailed,
    @NotNull @Min(0) int duplicated,
    @NotNull @Min(0) int failed) {
  public static final String SCHEMA_NAME = "ImportStatistics";
}
