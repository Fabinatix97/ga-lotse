/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const baseQueryKey = queryKeyFactory([["libEmployeePortal"]]);

export const userApiQueryKey = queryKeyFactory(baseQueryKey(["userApi"]));
