/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/**
 * Request to add, update or remove inventory items to an inspection.
 *
 * @param inventoryId the id of the inventory
 * @param count the new count of the inventory item which should be booked in base. Set to 0 to
 *     remove the inventory.
 */
@Schema(name = "UpdateInspectionModifyInventoryRequest")
public record UpdateInspectionModifyInventoryRequest(
    @NotNull UUID inventoryId, Long bookingId, @NotNull @Min(0) int count) {}
