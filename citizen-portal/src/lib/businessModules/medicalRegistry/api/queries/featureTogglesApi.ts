/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal/api/featureToggles";
import {
  ApiGetMedicalRegistryFeatureTogglesResponse,
  ApiMedicalRegistryFeature,
} from "@eshg/medical-registry-api";

import { useFeatureTogglesApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import { medicalRegistryFeatureTogglesPublicApiQueryKey } from "@/lib/businessModules/medicalRegistry/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiMedicalRegistryFeature) {
  return useGetMedicalRegistryFeatureToggle(selectEnabledNewFeature(name));
}

export function useIsOldFeatureDisabled(name: ApiMedicalRegistryFeature) {
  return useGetMedicalRegistryFeatureToggle(selectDisabledOldFeature(name));
}

function useGetMedicalRegistryFeatureToggle<TValue>(
  select: (
    featureToggles: ApiGetMedicalRegistryFeatureTogglesResponse,
  ) => TValue,
): TValue {
  const featureTogglesApi = useFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: medicalRegistryFeatureTogglesPublicApiQueryKey([
      "getFeatureToggles",
    ]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
