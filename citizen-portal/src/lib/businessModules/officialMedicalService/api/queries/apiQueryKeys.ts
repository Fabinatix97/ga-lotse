/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["officialMedicalService"]);

export const citizenPublicApiQueryKey = queryKeyFactory(
  apiQueryKey(["citizenPublicApi"]),
);

export const citizenAuthApiQueryKey = queryKeyFactory(
  apiQueryKey(["citizenAuthApi"]),
);
