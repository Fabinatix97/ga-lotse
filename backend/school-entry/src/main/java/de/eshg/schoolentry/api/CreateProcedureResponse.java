/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateProcedureResponse(
    @NotNull
        @Schema(
            description = "Id of the Procedure.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID procedureId) {}
