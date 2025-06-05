/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

const apiQueryKey = queryKeyFactory(["travelMedicine"]);

export const citizenPublicApiQueryKey = queryKeyFactory(
  apiQueryKey(["citizenPublicApi"]),
);

export const citizenAuthApiQueryKey = queryKeyFactory(
  apiQueryKey(["citizenAuthApi"]),
);

export const travelMedicineFeatureTogglesPublicApiQueryKey = queryKeyFactory(
  apiQueryKey(["travelMedicineFeatureTogglesPublicApi"]),
);
