/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "The list of possible parameters by which Inventory Items can be sorted.")
public enum InventorySortKey {
  COUNT,
  NAME,
  TYPE,
  RELEVANCE
}
