/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.bundId.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(
    description =
        "Request used for establishing a link between a BundId user and a reference person")
public record AddBundIdPersonLinkRequest(
    @Schema(description = "The id of the bundId user", example = "To be added") @NotBlank
        String bundId,
    @Schema(
            description = "The (external) id of the reference person",
            example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID referencePersonId) {}
