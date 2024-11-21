/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SchoolEntryPublicCitizenApi } from "@eshg/citizen-portal-api/schoolEntry";
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
