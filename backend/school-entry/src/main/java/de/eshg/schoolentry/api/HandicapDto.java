/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Handicap", description = "Results for the assessment of the handicap.")
public record HandicapDto(
    @Valid @NotNull @Schema(description = "Diagnosis related to chronic diseases.")
        HandicapWithDiagnosisDto chronicDisease,
    @Valid @NotNull @Schema(description = "Diagnosis related to disability.")
        HandicapWithDiagnosisDto disability,
    DisabilityTypeDto disabilityType,
    String note) {}
