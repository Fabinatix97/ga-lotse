/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

const apiQueryKey = queryKeyFactory(["prostituteProtection"]);

export const prostituteProtectionPublicCitizenApiQueryKey = queryKeyFactory(
  apiQueryKey(["prostituteProtectionPublicCitizenApi"]),
);
