/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.label.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.UUID;

@Schema(
    name = "Label",
    description =
        "Labels are primarily used to further categorize Resources and Inventory, apart from their respective types.")
public record LabelDto(
    @Schema(description = "The Id of the label.", example = "de9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @Schema(
            description =
                "The name of the label (e.g. the name of a business module to which certain Inventory Items or Resources may belong).",
            example = "Travel Medicine")
        @NotBlank
        String name)
    implements Serializable {}
