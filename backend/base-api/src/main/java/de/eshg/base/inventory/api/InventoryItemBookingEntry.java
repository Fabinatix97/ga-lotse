/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public record InventoryItemBookingEntry(
    @Schema(
            description =
                "The Id of the booking. This Id is publicly referenced in the booking history.",
            example = "123")
        @NotNull
        long bookingId,
    @Schema(
            description = "The Id of the Inventory Item for which the amount of stock was booked.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID inventoryId,
    @NotNull InventoryBookingStatusDto status,
    @NotNull InventoryBookingTypeDto type,
    @Schema(
            description =
                "The Id of the User who booked the amount of stock of the Inventory Item.",
            example = "ce9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID userId,
    @Schema(description = "The time when the booking was ordered.") @NotNull Instant bookedAt,
    @Schema(
            description =
                "The amount of stock of the Inventory Item, which is booked for this entry.",
            example = "200")
        @NotNull
        @Min(0)
        int amount,
    @Schema(
            description =
                "The Id with which a booking can be cancelled. This Id is private and shall be stored in the business module that did the booking.",
            example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID ownerKey) {}
