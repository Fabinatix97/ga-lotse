/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import de.eshg.base.inventory.api.InventoryItemTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InspectionInventory")
public record InspectionInventoryDto(
    @NotNull UUID baseInventoryId,
    @NotNull String name,
    @NotNull InventoryItemTypeDto type,
    @NotNull int count,
    Long bookingId) {}
