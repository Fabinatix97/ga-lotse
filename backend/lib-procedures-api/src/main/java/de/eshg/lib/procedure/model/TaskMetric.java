/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record TaskMetric(
    @NotNull TaskTypeDto taskType,
    @NotNull int noOccurrencesCount,
    @NotNull int oneOccurrenceCount,
    @NotNull int twoOccurrencesCount,
    @NotNull int moreThanTwoOccurrencesCount,
    @Schema(description = "A duration in ISO 8601") String averageDuration) {}
