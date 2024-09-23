/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetTravelMedicineFeatureTogglesResponse,
  ApiTravelMedicineFeature,
} from "@eshg/employee-portal-api/travelMedicine";
import {
  FeatureToggleQueryOptions,
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
  useGetFeatureToggleUnsuspended,
} from "@eshg/lib-portal/api/featureToggles";
import { UseQueryResult } from "@tanstack/react-query";

import { useFeatureTogglesApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { travelMedicineFeatureTogglesPublicApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

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

export function useIsNewFeatureEnabledUnsuspended(
  name: ApiTravelMedicineFeature,
): UseQueryResult<boolean> {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggleUnsuspended(enabledNewFeatureQuery);
}

function useEnabledNewFeatureToggleQuery(
  name: ApiTravelMedicineFeature,
): FeatureToggleQueryOptions<ApiTravelMedicineFeature, boolean> {
  return useFeatureToggleQuery(selectEnabledNewFeature(name));
}

function useFeatureToggleQuery<TValue>(
  select: (
    featureToggles: ApiGetTravelMedicineFeatureTogglesResponse,
  ) => TValue,
): FeatureToggleQueryOptions<ApiTravelMedicineFeature, TValue> {
  const featureTogglesApi = useFeatureTogglesApi();
  return {
    queryKey: travelMedicineFeatureTogglesPublicApiQueryKey([
      "getFeatureToggles",
    ]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  };
}
