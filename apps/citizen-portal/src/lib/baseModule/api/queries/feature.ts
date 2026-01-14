/**
 * Copyright 2026 cronn GmbH
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
} from "@eshg/lib-portal";

import { useFeatureTogglesApi } from "@/lib/baseModule/api/clients";
import { baseFeatureTogglesApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiBaseFeature) {
  return useGetBaseFeatureToggle(selectEnabledNewFeature(name));
}

export function useIsOldFeatureDisabled(name: ApiBaseFeature) {
  return useGetBaseFeatureToggle(selectDisabledOldFeature(name));
}

function useGetBaseFeatureToggle<TValue>(
  select: (featureToggles: ApiGetBaseFeatureTogglesResponse) => TValue,
): TValue {
  const featureTogglesApi = useFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: baseFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
