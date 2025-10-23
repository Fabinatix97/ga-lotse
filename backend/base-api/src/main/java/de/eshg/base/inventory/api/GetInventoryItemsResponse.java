/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import de.eshg.api.commons.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetInventoryItemsResponse(
    @NotNull @Valid List<InventoryItemDto> elements,
    @Schema(description = "The total number of Inventory Items in the response.") @NotNull @Min(0)
        long totalNumberOfElements)
    implements PagedResponse<InventoryItemDto> {}
