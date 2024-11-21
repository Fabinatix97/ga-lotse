/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;

public record RegisterAnonymousUserResponse(
    @Schema(
            description = "Id of the anonymous user",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID userId,
    @Schema(description = "The access code for the anonymous user", example = "Wzhu89yP4F728jVTT")
        @NotNull
        String accessCode,
    @Schema(description = "The PIN for anonymous authorization.", example = "654321")
        @NotBlank
        @Pattern(regexp = "\\d{6}", message = "The PIN must contain exactly 6 digits")
        String pin) {}
