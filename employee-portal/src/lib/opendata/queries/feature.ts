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
  ApiGetOpenDataFeatureTogglesResponse,
  ApiOpenDataFeature,
} from "@eshg/opendata-api";

import { useOpenDataFeatureToggleApi } from "@/lib/opendata/api/clients";
import { openDataFeatureTogglesApiQueryKey } from "@/lib/opendata/queries/queryKeys";

export function useIsNewFeatureEnabled(name: ApiOpenDataFeature): boolean {
  try {
    return useGetOpenDataFeatureToggle(selectEnabledNewFeature(name));
  } catch {
    return false;
  }
}

export function useIsOldFeatureDisabled(name: ApiOpenDataFeature): boolean {
  return useGetOpenDataFeatureToggle(selectDisabledOldFeature(name));
}

function useGetOpenDataFeatureToggle<TValue>(
  select: (featureToggles: ApiGetOpenDataFeatureTogglesResponse) => TValue,
): TValue {
  const featureTogglesApi = useOpenDataFeatureToggleApi();
  return useGetFeatureToggle({
    queryKey: openDataFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
