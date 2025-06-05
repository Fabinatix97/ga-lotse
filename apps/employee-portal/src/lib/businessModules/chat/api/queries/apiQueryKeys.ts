/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

const apiQueryKey = queryKeyFactory(["chat"]);

export const userSettingsApiQueryKey = queryKeyFactory(
  apiQueryKey(["userSettingsApi"]),
);

export const chatFeatureTogglesApiQueryKey = queryKeyFactory(
  apiQueryKey(["chatFeatureTogglesApi"]),
);

export const departmentApiQueryKey = queryKeyFactory(
  apiQueryKey(["departmentApi"]),
);

export const selfUserChatAttributesApiQueryKey = queryKeyFactory(
  apiQueryKey(["userApi"]),
);
