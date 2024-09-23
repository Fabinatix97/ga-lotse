/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import de.eshg.base.PagedResponse;
import de.eshg.base.user.api.UserDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record InventoryItemBookingHistory(
    @Valid @NotNull InventoryItemDto item,
    @Valid @NotNull List<InventoryItemBookingEntry> elements,
    @Schema(description = "The total number booking entries of an Inventory Item in the response.")
        @NotNull
        long totalNumberOfElements,
    @Valid @NotNull Map<UUID, UserDto> resolvedUsers)
    implements PagedResponse<InventoryItemBookingEntry> {}
