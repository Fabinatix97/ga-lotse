/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyPinRequest(
    @NotBlank @Pattern(regexp = "\\d{6}", message = "The PIN must contain exactly 6 digits")
        String pin) {}
