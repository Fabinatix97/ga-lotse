/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["medicalRegistry"]);

export const medicalRegistryApiQueryKey = queryKeyFactory(
  apiQueryKey(["medicalRegistryApi"]),
);

export const fileApiQueryKey = queryKeyFactory(apiQueryKey(["fileApi"]));

export const progressEntryApiQueryKey = queryKeyFactory(
  apiQueryKey(["progressEntryApi"]),
);

export const archivingApiQueryKey = queryKeyFactory(
  apiQueryKey(["archivingApi"]),
);
