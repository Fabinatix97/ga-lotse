/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetEmployeeSelfStatisticsResponse(
    @Valid @NotNull List<WeeklyDataBinDto> examinationsByWeek) {}
