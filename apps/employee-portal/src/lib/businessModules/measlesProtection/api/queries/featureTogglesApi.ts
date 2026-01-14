/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal";
import {
  ApiGetMeaslesProtectionFeatureTogglesResponse,
  ApiMeaslesProtectionFeature,
} from "@eshg/measles-protection-api";

import { useFeatureTogglesApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(
  name: ApiMeaslesProtectionFeature,
): boolean {
  return useGetMeaslesProtectionFeatureToggle(selectEnabledNewFeature(name));
}

export function useIsOldFeatureDisabled(
  name: ApiMeaslesProtectionFeature,
): boolean {
  return useGetMeaslesProtectionFeatureToggle(selectDisabledOldFeature(name));
}

function useGetMeaslesProtectionFeatureToggle<TValue>(
  select: (
    featureToggles: ApiGetMeaslesProtectionFeatureTogglesResponse,
  ) => TValue,
): TValue {
  const featureTogglesApi = useFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: measlesProtectionApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
