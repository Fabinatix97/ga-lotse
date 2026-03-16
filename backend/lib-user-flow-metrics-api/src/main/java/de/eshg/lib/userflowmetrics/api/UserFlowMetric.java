/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.api;

import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record UserFlowMetric(
    @NotNull BusinessModule businessModule,
    @NotNull UserFlowTypeDto userFlowType,
    @NotNull long total,
    @Schema(description = "A duration in ISO 8601") String averageDuration,
    @NotNull long abortedCount) {}
