/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import de.eshg.base.user.api.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetReportSeriesEntriesOfStatisticResponse(
    @NotNull UUID statisticId,
    @NotBlank String statisticName,
    @NotNull @Valid List<ReportSeriesDto> reportSeriesEntries,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers) {}
