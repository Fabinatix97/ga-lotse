/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateAnonymousUserResponse(
    @Schema(
            description = "The access code for the anonymous citizen user",
            example = "Wzhu89yP4F728jVTT")
        @NotNull
        @Size(min = 17, max = 17)
        String accessCode,
    @NotNull UUID procedureId) {}
