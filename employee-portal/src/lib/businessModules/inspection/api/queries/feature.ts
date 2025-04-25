/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UseQueryResult } from "@tanstack/react-query";

import {
  ApiGetInspectionFeatureTogglesResponse,
  ApiInspectionFeature,
} from "@eshg/inspection-api";
import {
  FeatureToggleQueryOptions,
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
  useGetFeatureToggleUnsuspended,
} from "@eshg/lib-portal/api/featureToggles";

import { useInspectionFeatureTogglesApi } from "@/lib/businessModules/inspection/api/clients";
import { inspectionFeatureTogglesApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiInspectionFeature): boolean {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggle(enabledNewFeatureQuery);
}

export function useIsNewFeatureEnabledUnsuspended(
  name: ApiInspectionFeature,
): UseQueryResult<boolean> {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggleUnsuspended(enabledNewFeatureQuery);
}

export function useIsOldFeatureDisabled(name: ApiInspectionFeature): boolean {
  const disabledOldFeatureQuery = useFeatureToggleQuery(
    selectDisabledOldFeature(name),
  );
  return useGetFeatureToggle(disabledOldFeatureQuery);
}

function useEnabledNewFeatureToggleQuery(
  name: ApiInspectionFeature,
): FeatureToggleQueryOptions<ApiInspectionFeature, boolean> {
  return useFeatureToggleQuery(selectEnabledNewFeature(name));
}

function useFeatureToggleQuery<TValue>(
  select: (featureToggles: ApiGetInspectionFeatureTogglesResponse) => TValue,
): FeatureToggleQueryOptions<ApiInspectionFeature, TValue> {
  const featureTogglesApi = useInspectionFeatureTogglesApi();
  return {
    queryKey: inspectionFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  };
}
