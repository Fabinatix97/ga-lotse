/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["base"]);

export const departmentApiQueryKey = queryKeyFactory(
  apiQueryKey(["departmentApi"]),
);
