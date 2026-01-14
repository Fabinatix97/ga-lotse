/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "InventoryItemType",
    description = "The list of possible types under which Inventory Items can be categorized.")
public enum InventoryItemTypeDto {
  VACCINE,
  PROTECTIVE_EQUIPMENT,
  TEST_KIT,
  MISC
}
