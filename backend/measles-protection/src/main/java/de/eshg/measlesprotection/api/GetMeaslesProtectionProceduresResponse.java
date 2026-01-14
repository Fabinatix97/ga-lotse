/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetMeaslesProtectionProceduresResponse(
    @NotNull @Schema(description = "The number of total pages") int totalPages,
    @NotNull @Schema(description = "the total amount of elements") long totalElements,
    @NotNull @Valid List<ProtectionProcedureDto> procedures) {}
