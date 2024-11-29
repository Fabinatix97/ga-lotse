/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateProphylaxisSessionResponse(
    @NotNull
        @Schema(
            description = "Id of the prophylaxis session.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID id) {}
