/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetSchoolEntryFeatureTogglesResponse,
  ApiSchoolEntryFeature,
} from "@eshg/employee-portal-api/schoolEntry";
import {
  FeatureToggleQueryOptions,
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
  useGetFeatureToggleUnsuspended,
} from "@eshg/lib-portal/api/featureToggles";
import { UseQueryResult } from "@tanstack/react-query";

import { useFeatureTogglesApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { schoolEntryFeatureTogglesApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiSchoolEntryFeature): boolean {
  return useGetSchoolEntryFeatureToggle(selectEnabledNewFeature(name));
}

export function useIsNewFeatureEnabledUnsuspended(
  name: ApiSchoolEntryFeature,
): UseQueryResult<boolean> {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggleUnsuspended(enabledNewFeatureQuery);
}

function useEnabledNewFeatureToggleQuery(
  name: ApiSchoolEntryFeature,
): FeatureToggleQueryOptions<ApiSchoolEntryFeature, boolean> {
  return useFeatureToggleQuery(selectEnabledNewFeature(name));
}

function useFeatureToggleQuery<TValue>(
  select: (featureToggles: ApiGetSchoolEntryFeatureTogglesResponse) => TValue,
): FeatureToggleQueryOptions<ApiSchoolEntryFeature, TValue> {
  const featureTogglesApi = useFeatureTogglesApi();
  return {
    queryKey: schoolEntryFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  };
}

export function useIsOldFeatureDisabled(name: ApiSchoolEntryFeature): boolean {
  return useGetSchoolEntryFeatureToggle(selectDisabledOldFeature(name));
}

function useGetSchoolEntryFeatureToggle<TValue>(
  select: (featureToggles: ApiGetSchoolEntryFeatureTogglesResponse) => TValue,
): TValue {
  const featureTogglesApi = useFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: schoolEntryFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
