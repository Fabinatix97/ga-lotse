/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.label.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record AddLabelRequest(
    @Schema(
            description =
                "The name of a label (e.g. the name of a business module to which certain Inventory Items or Resources may belong).",
            example = "Travel Medicine")
        @NotBlank
        String name) {}
