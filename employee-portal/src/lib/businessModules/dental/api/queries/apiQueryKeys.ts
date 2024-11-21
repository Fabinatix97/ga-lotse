/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["dental"]);

export const dentalApiQueryKey = queryKeyFactory(apiQueryKey(["dentalApi"]));
