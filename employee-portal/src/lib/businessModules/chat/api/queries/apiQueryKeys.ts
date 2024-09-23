/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["chat"]);

export const chatApiQueryKey = queryKeyFactory(apiQueryKey(["chatApi"]));

export const userSettingsApiQueryKey = queryKeyFactory(
  apiQueryKey(["userSettingsApi"]),
);

export const chatFeatureTogglesApiQueryKey = queryKeyFactory(
  apiQueryKey(["chatFeatureTogglesApi"]),
);
