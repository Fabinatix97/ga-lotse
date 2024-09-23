/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "ReportInfo")
public record ReportInfoDto(
    @NotNull UUID id,
    @NotBlank String name,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull ReportStateDto state,
    LocalDate executionDate,
    @Min(0) Long totalNumberOfElements) {}
