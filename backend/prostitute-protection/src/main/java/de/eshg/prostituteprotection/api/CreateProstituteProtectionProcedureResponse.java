/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateProstituteProtectionProcedureResponse(
    @NotNull
        @Schema(
            description = "Id of the procedure.",
            example = "ae9211d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID id) {}
