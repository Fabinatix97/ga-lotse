/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "ReportSeries")
public record ReportSeriesDto(
    @NotNull UUID id,
    @NotNull UUID userId,
    @NotBlank String name,
    String description,
    Instant timeRangeStart,
    Instant timeRangeEnd,
    @NotNull UUID evaluationId,
    @NotNull ReportTypeDto reportType,
    Boolean active,
    Integer startMonth,
    FrequencyDto frequency,
    ReportingPeriodDto reportingPeriod,
    @NotNull @Size(min = 1) List<String> dataSourceNames,
    @NotNull @Valid List<ReportInfoDto> reportInfos) {}
