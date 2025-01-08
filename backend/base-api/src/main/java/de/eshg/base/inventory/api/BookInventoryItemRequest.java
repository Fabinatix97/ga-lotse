/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BookInventoryItemRequest(
    @Schema(
            description = "The amount of stock of an Inventory Item that shall be booked.",
            example = "200")
        @NotNull
        @Min(1)
        int bookingCount) {}
