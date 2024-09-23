/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  QueryKey,
  UseQueryResult,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

interface FeatureToggles<TName extends string> {
  enabledNewFeatures: Set<TName>;
  disabledOldFeatures: Set<TName>;
}

export interface FeatureToggleQueryOptions<
  TName extends string,
  TValue,
  TResponse extends FeatureToggles<TName> = FeatureToggles<TName>,
> {
  queryKey: QueryKey;
  queryFn: () => Promise<TResponse>;
  select: (featureToggles: TResponse) => TValue;
  throwOnError?: boolean;
}

export function selectEnabledNewFeature<TName extends string>(name: TName) {
  return (featureToggles: FeatureToggles<TName>) =>
    featureToggles.enabledNewFeatures.has(name);
}

export function selectDisabledOldFeature<TName extends string>(name: TName) {
  return (featureToggles: FeatureToggles<TName>) =>
    featureToggles.disabledOldFeatures.has(name);
}

const CACHE_DURATION = 86_400_000; // 1 day

export function useGetFeatureToggle<
  TName extends string,
  TValue,
  TResponse extends FeatureToggles<TName>,
>(options: FeatureToggleQueryOptions<TName, TValue, TResponse>): TValue {
  const { data } = useSuspenseQuery(getFeatureToggleQuery(options));
  return data;
}

export function useGetFeatureToggleUnsuspended<
  TName extends string,
  TValue,
  TResponse extends FeatureToggles<TName>,
>(
  options: FeatureToggleQueryOptions<TName, TValue, TResponse>,
): UseQueryResult<TValue> {
  return useQuery(getFeatureToggleQuery({ throwOnError: false, ...options }));
}

function getFeatureToggleQuery<
  TName extends string,
  TResponse extends FeatureToggles<TName>,
  TValue,
>(options: FeatureToggleQueryOptions<TName, TValue, TResponse>) {
  return {
    ...options,
    gcTime: CACHE_DURATION,
    staleTime: CACHE_DURATION,
  };
}
