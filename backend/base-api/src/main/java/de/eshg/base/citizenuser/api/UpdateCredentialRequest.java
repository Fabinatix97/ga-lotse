/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record UpdateCredentialRequest(
    CredentialTypeDto credentialType,
    @Schema(description = "The current secret value for verification", example = "654321") @NotBlank
        String currentSecret,
    @Schema(description = "The new secret value for update", example = "654321") @NotBlank
        String newSecret) {}
