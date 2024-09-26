/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record ProcedureMetric(
    @NotNull BusinessModule businessModule,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull long totalCount,
    @NotNull long openOrDraftCount,
    @NotNull long inProgressCount,
    @NotNull long abortedCount,
    @NotNull long closedCount,
    @Schema(description = "A duration in ISO 8601") String averageDuration) {}
