/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

const apiQueryKey = queryKeyFactory(["openData"]);

export const publicCitizenApiQueryKey = queryKeyFactory(
  apiQueryKey(["publicCitizenApi"]),
);
