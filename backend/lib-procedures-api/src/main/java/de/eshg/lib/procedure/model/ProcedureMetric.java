/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record ProcedureMetric(
    @CanBeLogged @NotNull BusinessModule businessModule,
    @CanBeLogged @NotNull ProcedureTypeDto procedureType,
    @CanBeLogged @NotNull long totalCount,
    @CanBeLogged @NotNull long openOrDraftCount,
    @CanBeLogged @NotNull long inProgressCount,
    @CanBeLogged @NotNull long abortedCount,
    @CanBeLogged @NotNull long closedCount,
    @CanBeLogged @Schema(description = "A duration in ISO 8601") String averageDuration) {}
