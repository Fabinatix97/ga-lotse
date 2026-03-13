/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.api;

import de.eshg.lib.common.BusinessModule;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetUserFlowMetricsResponse(
    @NotNull BusinessModule businessModule, @Valid @NotNull List<UserFlowMetric> userFlowMetrics) {}
