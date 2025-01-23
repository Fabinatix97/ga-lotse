/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBaseFeature,
  ApiGetBaseFeatureTogglesResponse,
} from "@eshg/base-api";
import {
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal/api/featureToggles";

import { useBaseFeatureTogglesApi } from "@/lib/baseModule/api/clients";
import { baseFeatureTogglesApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useIsNewFeatureEnabled(name: ApiBaseFeature): boolean {
  return useGetBaseFeatureToggle(selectEnabledNewFeature(name));
}

export function useIsOldFeatureDisabled(name: ApiBaseFeature): boolean {
  return useGetBaseFeatureToggle(selectDisabledOldFeature(name));
}

function useGetBaseFeatureToggle<TValue>(
  select: (featureToggles: ApiGetBaseFeatureTogglesResponse) => TValue,
): TValue {
  const featureTogglesApi = useBaseFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: baseFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
