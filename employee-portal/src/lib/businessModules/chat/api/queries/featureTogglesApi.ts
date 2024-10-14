/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiChatFeature,
  ApiGetFeatureTogglesResponse,
} from "@eshg/employee-portal-api/chatManagement";
import {
  FeatureToggleQueryOptions,
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
  useGetFeatureToggleUnsuspended,
} from "@eshg/lib-portal/api/featureToggles";
import { UseQueryResult } from "@tanstack/react-query";

import { useFeatureTogglesApi } from "@/lib/businessModules/chat/api/clients";
import { chatFeatureTogglesApiQueryKey } from "@/lib/businessModules/chat/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiChatFeature): boolean {
  return useGetChatFeatureToggle(selectEnabledNewFeature(name));
}

export function useIsNewFeatureEnabledUnsuspended(
  name: ApiChatFeature,
): UseQueryResult<boolean> {
  const enabledNewFeatureQuery = useEnabledNewFeatureToggleQuery(name);
  return useGetFeatureToggleUnsuspended(enabledNewFeatureQuery);
}

function useEnabledNewFeatureToggleQuery(
  name: ApiChatFeature,
): FeatureToggleQueryOptions<ApiChatFeature, boolean> {
  return useFeatureToggleQuery(selectEnabledNewFeature(name));
}

function useFeatureToggleQuery<TValue>(
  select: (featureToggles: ApiGetFeatureTogglesResponse) => TValue,
): FeatureToggleQueryOptions<ApiChatFeature, TValue> {
  const featureTogglesApi = useFeatureTogglesApi();
  return {
    queryKey: chatFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  };
}

export function useIsOldFeatureDisabled(name: ApiChatFeature): boolean {
  return useGetChatFeatureToggle(selectDisabledOldFeature(name));
}

function useGetChatFeatureToggle<TValue>(
  select: (featureToggles: ApiGetFeatureTogglesResponse) => TValue,
): TValue {
  const featureTogglesApi = useFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: chatFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
