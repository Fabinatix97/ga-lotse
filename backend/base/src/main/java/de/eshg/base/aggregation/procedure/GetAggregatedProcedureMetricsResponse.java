/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.procedure;

import de.eshg.lib.procedure.model.ProcedureActionMetric;
import de.eshg.lib.procedure.model.ProcedureMetric;
import de.eshg.lib.userflowmetrics.api.UserFlowMetric;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAggregatedProcedureMetricsResponse(
    @NotNull @Valid List<ProcedureMetric> procedureMetrics,
    @NotNull @Valid List<ProcedureActionMetric> procedureActionMetrics,
    @NotNull @Valid List<UserFlowMetric> userFlowMetrics,
    @NotNull @Valid List<ErrorResponseWithLocation> errorResponses) {}
