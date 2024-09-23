/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import de.eshg.lib.common.BusinessModule;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetTaskMetricsResponse(
    @CanBeLogged @NotNull BusinessModule businessModule,
    @CanBeLogged @NotNull ProcedureTypeDto procedureType,
    @CanBeLogged @NotNull long closedProcedureCount,
    @Valid @NotNull List<TaskMetric> taskMetrics,
    @Valid @NotNull List<ProcedureWithDuration> fastestProcedures,
    @Valid @NotNull List<ProcedureWithDuration> slowestProcedures) {}
