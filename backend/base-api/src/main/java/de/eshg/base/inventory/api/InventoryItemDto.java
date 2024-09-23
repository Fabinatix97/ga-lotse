/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import de.eshg.base.label.api.LabelDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Schema(name = "InventoryItem")
public record InventoryItemDto(
    @Schema(
            description = "Id of the Inventory Item.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        @NotNull
        long version,
    @Schema(
            description = "The name of the Inventory Item.",
            example = "Example Manufacturer's Vaccine")
        @NotBlank
        String name,
    @Schema(
            description = "Free text field for descriptive information on the Inventory Item.",
            example = "The vaccine is stored in a red container in the fridge of the storage room.")
        String description,
    @Schema(
            description =
                "A descriptive number of the Inventory Item, e.g. the article or model number.",
            example = "T-800")
        String articleNumber,
    @NotNull InventoryItemTypeDto type,
    @NotNull @Valid List<LabelDto> labels,
    @Schema(
            description =
                "The amount of stock of the Inventory Item, which is currently available to be booked.",
            example = "500")
        @NotNull
        @Min(0)
        int count,
    @Schema(
            description =
                "When this amount of stock of the Inventory Item is reached, a graphic warning is displayed in the overview list.",
            example = "100")
        @NotNull
        @Min(0)
        int minCount)
    implements Serializable {}
