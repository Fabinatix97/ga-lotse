/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";
import { SchoolEntryPublicCitizenApi } from "@eshg/school-entry-api";
import { queryOptions } from "@tanstack/react-query";

import { schoolEntryPublicCitizenApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function getOpeningHoursQuery(
  publicCitizenApi: SchoolEntryPublicCitizenApi,
) {
  return queryOptions({
    queryKey: schoolEntryPublicCitizenApiQueryKey(["getOpeningHours"]),
    queryFn: () => publicCitizenApi.getOpeningHours(),
  });
}

export function getDepartmentInfoQuery(
  publicCitizenApi: SchoolEntryPublicCitizenApi,
) {
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: schoolEntryPublicCitizenApiQueryKey(["getDepartmentInfo"]),
    queryFn: () => publicCitizenApi.getDepartmentInfo(),
  });
}
