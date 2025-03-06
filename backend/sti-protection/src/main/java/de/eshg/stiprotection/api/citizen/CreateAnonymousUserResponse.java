/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateAnonymousUserResponse(
    @Schema(
            description = "ID of the anonymous citizen user",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID userId,
    @Schema(
            description = "The access code for the anonymous citizen user",
            example = "Wzhu89yP4F728jVTT")
        @NotNull
        @Size(min = 17, max = 17)
        String accessCode) {}
