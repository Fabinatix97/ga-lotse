/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.base.user.api.UserDto;
import de.eshg.statistics.api.evaluation.EvaluationInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetDetailPageInformationResponse(
    @NotNull @Valid EvaluationInfo evaluationInfo,
    @NotNull @Valid List<TableColumnHeader> tableColumnHeaders,
    @NotNull @Min(0) long totalNumberOfElements,
    @Valid UserDto user,
    @NotNull @Valid List<AnalysisDto> analyses) {}
