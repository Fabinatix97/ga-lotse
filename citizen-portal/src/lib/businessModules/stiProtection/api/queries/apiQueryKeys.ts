/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["stiProtection"]);

export const stiProtectionCitizenApiQueryKey = queryKeyFactory(
  apiQueryKey(["stiProtectionCitizenApi"]),
);

export const stiProtectionPublicCitizenApiQueryKey = queryKeyFactory(
  apiQueryKey(["stiProtectionPublicCitizenApi"]),
);
