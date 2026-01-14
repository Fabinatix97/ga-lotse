/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import de.eshg.base.user.api.UserDto;
import de.eshg.statistics.api.evaluation.EvaluationDataSensitivity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetReportSeriesEntriesOfEvaluationResponse(
    @NotNull UUID evaluationId,
    @NotBlank String evaluationName,
    @NotNull EvaluationDataSensitivity dataSensitivity,
    @NotNull @Valid List<ReportSeriesDto> reportSeriesEntries,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers) {}
