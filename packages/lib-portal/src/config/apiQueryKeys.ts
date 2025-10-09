/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryKeyFactory } from "../api/queryKeyFactory";

const baseQueryKey = queryKeyFactory([["libPortal"]]);

export const streetApiQueryKey = queryKeyFactory(baseQueryKey(["streetApi"]));
