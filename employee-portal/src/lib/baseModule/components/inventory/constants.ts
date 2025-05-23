/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInventoryItemType } from "@eshg/base-api";
import { buildEnumOptions } from "@eshg/lib-portal";

export const inventoryItemTypeNames = {
  [ApiInventoryItemType.TestKit]: "TestKit",
  [ApiInventoryItemType.Vaccine]: "Impfstoff",
  [ApiInventoryItemType.ProtectiveEquipment]: "Schutzausrüstung",
  [ApiInventoryItemType.Misc]: "Sonstiges",
} as const satisfies Record<ApiInventoryItemType, string>;

export const inventoryTypeOptions = buildEnumOptions<ApiInventoryItemType>(
  inventoryItemTypeNames,
);
