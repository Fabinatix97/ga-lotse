/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;

public record GetMedsAbroadProceduresResponse(
    @NotNull @Schema(description = "The number of total pages") @PositiveOrZero int totalPages,
    @NotNull @Schema(description = "The total amount of elements") @PositiveOrZero
        long totalElements,
    @NotNull @Valid List<MedsAbroadProcedureDto> procedures) {}
