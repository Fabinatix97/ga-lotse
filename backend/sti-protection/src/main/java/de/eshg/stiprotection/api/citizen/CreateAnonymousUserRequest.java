/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreateAnonymousUserRequest(
    @Schema(description = "The PIN for anonymous authorization.", example = "654321")
        @NotNull
        @Pattern(regexp = "\\d{6}", message = "The PIN must contain exactly 6 digits")
        String pin,
    @Schema(description = "Optional personal details information for resubmission on failure")
        @Valid
        AddPersonalDetailsRequest personalDetails) {}
