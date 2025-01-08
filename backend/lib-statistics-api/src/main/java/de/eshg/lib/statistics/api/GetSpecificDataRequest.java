/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public record GetSpecificDataRequest(
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull UUID dataSourceId,
    @NotNull boolean anonymizationRequired,
    @NotNull List<String> attributeCodes,
    @Min(0) @Schema(defaultValue = "0") Integer page,
    @Min(1) @Schema(defaultValue = "25") Integer pageSize) {

  public GetSpecificDataRequest(
      Instant timeRangeStart,
      Instant timeRangeEnd,
      UUID dataSourceId,
      boolean anonymizationRequired,
      List<String> attributeCodes,
      Integer page,
      Integer pageSize) {
    this.timeRangeStart = timeRangeStart;
    this.timeRangeEnd = timeRangeEnd;
    this.dataSourceId = dataSourceId;
    this.anonymizationRequired = anonymizationRequired;
    this.attributeCodes = attributeCodes;
    this.page = Optional.ofNullable(page).orElse(0);
    this.pageSize = Optional.ofNullable(pageSize).orElse(25);
  }
}
