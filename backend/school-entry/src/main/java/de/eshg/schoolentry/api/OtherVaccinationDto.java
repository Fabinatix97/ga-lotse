/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(name = "OtherVaccination")
public record OtherVaccinationDto(
    @NotNull
        @Schema(
            description = "Description/name of the additional vaccination.",
            example = "COVID-19")
        String description,
    @NotNull @Min(1) @Max(8) @Schema(description = "Number of vaccinations.") Integer count) {}
