/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetTravelMedicineFeatureTogglesResponse,
  ApiTravelMedicineFeature,
} from "@eshg/citizen-portal-api/travelMedicine";
import {
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal/api/featureToggles";

import { useFeatureTogglesApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { travelMedicineFeatureTogglesPublicApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiTravelMedicineFeature) {
  return useGetTravelMedicineFeatureToggle(selectEnabledNewFeature(name));
}

export function useIsOldFeatureDisabled(name: ApiTravelMedicineFeature) {
  return useGetTravelMedicineFeatureToggle(selectDisabledOldFeature(name));
}

function useGetTravelMedicineFeatureToggle<TValue>(
  select: (
    featureToggles: ApiGetTravelMedicineFeatureTogglesResponse,
  ) => TValue,
): TValue {
  const featureTogglesApi = useFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: travelMedicineFeatureTogglesPublicApiQueryKey([
      "getFeatureToggles",
    ]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
