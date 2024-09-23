/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateInventoryItemCountRequest(
    @Schema(
            description =
                "The version of the Inventory Item whose amount of stock shall be changed. This value has to coincide with the actual version of the Inventory Item to avoid race conditions.")
        @NotNull
        @Min(0)
        long version,
    @Schema(
            description =
                "The corrected amount of stock of the Inventory Item, which is currently available.",
            example = "400")
        @NotNull
        @Min(0)
        int count) {}
