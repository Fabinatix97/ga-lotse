/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";
import { ProstituteProtectionPublicCitizenApi } from "@eshg/prostitute-protection-api";

import { prostituteProtectionPublicCitizenApiQueryKey } from "@/lib/businessModules/prostituteProtection/api/queries/apiQueryKeys";

export function getOpeningHoursQuery(
  publicCitizenApi: ProstituteProtectionPublicCitizenApi,
) {
  return queryOptions({
    queryKey: prostituteProtectionPublicCitizenApiQueryKey(["getOpeningHours"]),
    queryFn: () => publicCitizenApi.getOpeningHours(),
  });
}

export function getDepartmentInfoQuery(
  publicCitizenApi: ProstituteProtectionPublicCitizenApi,
) {
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: prostituteProtectionPublicCitizenApiQueryKey([
      "getDepartmentInfo",
    ]),
    queryFn: () => publicCitizenApi.getDepartmentInfo(),
  });
}
