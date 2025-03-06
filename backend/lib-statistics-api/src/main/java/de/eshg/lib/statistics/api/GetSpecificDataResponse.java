/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

public record GetSpecificDataResponse(
    @NotBlank String dataSourceName,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull DataSourceSensitivity sensitivity,
    @NotNull @Valid DataTableHeader dataTableHeader,
    @NotNull @Valid List<DataRow> dataRows,
    @NotNull @Min(0) long totalNumberOfElements) {}
