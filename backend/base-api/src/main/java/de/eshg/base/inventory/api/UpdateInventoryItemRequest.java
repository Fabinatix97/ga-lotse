/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateInventoryItemRequest(
    @Schema(
            description = "The name of the Inventory Item.",
            example = "Example Manufacturer\"s Vaccine")
        @NotBlank
        String name,
    @NotNull InventoryItemTypeDto type,
    @Schema(
            description = "Free text field for descriptive information on the Inventory Item.",
            example = "The vaccine is stored in a red container in the fridge of the storage room.")
        String description,
    @Schema(
            description =
                "A descriptive number of the Inventory Item, e.g. the article or model number.",
            example = "T-800")
        String articleNumber,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "A list of label names. Any provided name will be used to resolve existing labels from the database.",
                    example = "['Label1','Label2','Label3']"))
        List<String> labelNames,
    @Schema(
            description =
                "When this amount of stock of the Inventory Item is reached, a graphic warning is displayed in the overview list.",
            example = "100")
        @NotNull
        @Min(0)
        int minCount) {

  public UpdateInventoryItemRequest(String name, InventoryItemTypeDto type, int minCount) {
    this(name, type, null, null, List.of(), minCount);
  }
}
