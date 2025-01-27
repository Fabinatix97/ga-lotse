/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
