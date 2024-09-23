/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record TaskMetric(
    @CanBeLogged @NotNull TaskTypeDto taskType,
    @CanBeLogged @NotNull int noOccurrencesCount,
    @CanBeLogged @NotNull int oneOccurrenceCount,
    @CanBeLogged @NotNull int twoOccurrencesCount,
    @CanBeLogged @NotNull int moreThanTwoOccurrencesCount,
    @CanBeLogged @Schema(description = "A duration in ISO 8601") String averageDuration) {}
