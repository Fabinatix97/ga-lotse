/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import de.eshg.base.user.api.UserDto;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.api.TableColumnHeader;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GetReportDetailPageResponse(
    @NotNull UUID id,
    @NotNull UUID reportSeriesId,
    @NotBlank String name,
    String description,
    @NotNull @Min(1) int numberOfReportsInSeries,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull Instant createdAt,
    @NotNull @Valid List<TableColumnHeader> tableColumnHeaders,
    @NotNull @Min(0) long totalNumberOfElements,
    @Valid UserDto userDto,
    @NotNull @Valid List<EvaluationDto> evaluation) {}
