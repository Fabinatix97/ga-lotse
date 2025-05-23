/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

const apiQueryKey = queryKeyFactory(["dental"]);

export const childApiQueryKey = queryKeyFactory(apiQueryKey(["childApi"]));
export const procedureLabelApiQueryKey = queryKeyFactory(
  apiQueryKey(["procedureLabelApi"]),
);
export const prophylaxisSessionApiQueryKey = queryKeyFactory(
  apiQueryKey(["prophylaxisSessionApi"]),
);
