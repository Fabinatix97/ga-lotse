/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

export const apiQueryKey = queryKeyFactory(["openData"]);

export const openDataApiQueryKey = queryKeyFactory(
  apiQueryKey(["openDataApi"]),
);

export const openDataFeatureTogglesApiQueryKey = queryKeyFactory(
  openDataApiQueryKey(["featureTogglesApi"]),
);
