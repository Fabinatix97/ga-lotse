/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal";
import {
  ApiGetOpenDataFeatureTogglesResponse,
  ApiOpenDataFeature,
} from "@eshg/opendata-api";

import { useOpenDataFeatureTogglesApi } from "@/lib/businessModules/opendata/api/clients";

import { publicCitizenApiQueryKey } from "./apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiOpenDataFeature) {
  try {
    return useGetOpenDataFeatureToggle(selectEnabledNewFeature(name));
  } catch {
    return false;
  }
}

export function useIsOldFeatureDisabled(name: ApiOpenDataFeature) {
  return useGetOpenDataFeatureToggle(selectDisabledOldFeature(name));
}

function useGetOpenDataFeatureToggle<TValue>(
  select: (featureToggles: ApiGetOpenDataFeatureTogglesResponse) => TValue,
): TValue {
  const featureTogglesApi = useOpenDataFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: publicCitizenApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
