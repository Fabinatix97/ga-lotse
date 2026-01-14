/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FeatureToggleQueryOptions,
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal";
import {
  ApiGetStatisticsFeatureTogglesResponse,
  ApiStatisticsFeature,
} from "@eshg/statistics-api";

import { useFeatureTogglesApi } from "@/lib/businessModules/statistics/api/clients";

import { statisticsFeatureTogglesApiQueryKey } from "./apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiStatisticsFeature): boolean {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggle(enabledNewFeatureQuery);
}

function useEnabledNewFeatureToggleQuery(
  name: ApiStatisticsFeature,
): FeatureToggleQueryOptions<ApiStatisticsFeature, boolean> {
  return useFeatureToggleQuery(selectEnabledNewFeature(name));
}

function useFeatureToggleQuery<TValue>(
  select: (featureToggles: ApiGetStatisticsFeatureTogglesResponse) => TValue,
): FeatureToggleQueryOptions<ApiStatisticsFeature, TValue> {
  const featureTogglesApi = useFeatureTogglesApi();
  return {
    queryKey: statisticsFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  };
}
