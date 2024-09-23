/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetSchoolEntryFeatureTogglesResponse,
  ApiSchoolEntryFeature,
} from "@eshg/employee-portal-api/schoolEntry";
import {
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal/api/featureToggles";

import { useFeatureTogglesApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { schoolEntryFeatureTogglesApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(name: ApiSchoolEntryFeature): boolean {
  return useGetSchoolEntryFeatureToggle(selectEnabledNewFeature(name));
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
