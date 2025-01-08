/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import de.eshg.base.user.api.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetReportsResponse(
    @NotNull @Valid List<ReportSeriesDto> reportSeriesList,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers,
    @NotNull @Min(0) long totalNumberOfElements) {}
