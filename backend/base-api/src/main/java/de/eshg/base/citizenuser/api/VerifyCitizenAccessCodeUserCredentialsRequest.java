/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record VerifyCitizenAccessCodeUserCredentialsRequest(
    CredentialTypeDto credentialType,
    @Schema(description = "The raw secret value for verification", example = "654321") @NotBlank
        String rawSecret) {}
