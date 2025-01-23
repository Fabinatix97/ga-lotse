/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetProceduresOverviewResponse(
    @NotNull @Schema(description = "The total number of pages") int totalPages,
    @NotNull @Schema(description = "The total amount of elements") long totalElements,
    @NotNull @Valid List<StiProtectionProcedureOverviewDto> procedures) {}
