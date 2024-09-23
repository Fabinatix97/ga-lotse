/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InventoryBookingStatus", description = "A list of possible statuses of a booking.")
public enum InventoryBookingStatusDto {
  ACTIVE,
  CANCELLED
}
