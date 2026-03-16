/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FeatureToggleQueryOptions,
  STATIC_QUERY_OPTIONS,
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal";
import {
  type ApiGetOmsFeatureTogglesResponse,
  type ApiOmsFeature,
} from "@eshg/official-medical-service-api";

import { useOmsFeatureTogglesApi } from "@/lib/businessModules/officialMedicalService/api/clients";

import { omsFeatureTogglesApiQueryKey } from "./apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiOmsFeature): boolean {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggle(enabledNewFeatureQuery);
}

export function useEnabledNewFeatureToggleQuery(
  name: ApiOmsFeature,
): FeatureToggleQueryOptions<ApiOmsFeature, boolean> {
  return useFeatureToggleQuery(selectEnabledNewFeature(name));
}

function useFeatureToggleQuery<TValue>(
  select: (featureToggles: ApiGetOmsFeatureTogglesResponse) => TValue,
): FeatureToggleQueryOptions<ApiOmsFeature, TValue> {
  const featureTogglesApi = useOmsFeatureTogglesApi();
  return {
    ...STATIC_QUERY_OPTIONS,
    queryKey: omsFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  };
}
