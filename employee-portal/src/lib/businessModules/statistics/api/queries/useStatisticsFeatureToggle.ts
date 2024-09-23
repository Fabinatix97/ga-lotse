/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetStatisticsFeatureTogglesResponse,
  ApiStatisticsFeature,
} from "@eshg/employee-portal-api/statistics";
import {
  FeatureToggleQueryOptions,
  selectEnabledNewFeature,
  useGetFeatureToggle,
  useGetFeatureToggleUnsuspended,
} from "@eshg/lib-portal/api/featureToggles";
import { UseQueryResult } from "@tanstack/react-query";

import { useFeatureTogglesApi } from "@/lib/businessModules/statistics/api/clients";

import { statisticsFeatureTogglesApiQueryKey } from "./apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiStatisticsFeature): boolean {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggle(enabledNewFeatureQuery);
}

export function useIsNewFeatureEnabledUnsuspended(
  name: ApiStatisticsFeature,
): UseQueryResult<boolean> {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggleUnsuspended(enabledNewFeatureQuery);
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
