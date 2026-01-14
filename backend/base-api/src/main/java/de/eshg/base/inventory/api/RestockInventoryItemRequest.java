/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RestockInventoryItemRequest(
    @Schema(
            description =
                "The amount of stock of the Inventory Item, which shall be added to the currently available amount.",
            example = "200")
        @NotNull
        @Min(1)
        int restockingCount) {}
