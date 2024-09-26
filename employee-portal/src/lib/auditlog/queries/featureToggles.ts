/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAuditLogFeature,
  ApiGetAuditLogFeatureTogglesResponse,
} from "@eshg/employee-portal-api/auditlog";
import {
  selectEnabledNewFeature,
  useGetFeatureToggle,
} from "@eshg/lib-portal/api/featureToggles";

import { useFeatureTogglesApi } from "@/lib/auditlog/api/clients";
import { auditLogFeatureTogglesApiQueryKey } from "@/lib/auditlog/queries/queryKeys";

export function useIsNewFeatureEnabled(name: ApiAuditLogFeature) {
  return useGetAuditLogFeatureToggle(selectEnabledNewFeature(name));
}

function useGetAuditLogFeatureToggle<TValue>(
  select: (featureToggles: ApiGetAuditLogFeatureTogglesResponse) => TValue,
): TValue {
  const featureTogglesApi = useFeatureTogglesApi();
  return useGetFeatureToggle({
    queryKey: auditLogFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select,
  });
}
