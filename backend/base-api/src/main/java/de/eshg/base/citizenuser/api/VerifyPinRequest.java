/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyPinRequest(
    @Schema(description = "The PIN for verification", example = "654321")
        @NotBlank
        @Pattern(regexp = "\\d{6}", message = "The PIN must contain exactly 6 digits")
        String pin) {}
