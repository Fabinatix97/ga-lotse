/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SchoolEntryCountryCodesApi } from "@eshg/employee-portal-api/schoolEntry";
import { queryOptions } from "@tanstack/react-query";

import { mapCountryCodes } from "@/lib/businessModules/schoolEntry/api/models/CountryCodes";
import { countryCodesApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

const CACHE_DURATION_1DAY = 86_400_000;

export function getCountryCodesQuery(
  countryCodesApi: SchoolEntryCountryCodesApi,
) {
  return queryOptions({
    queryKey: countryCodesApiQueryKey(["getCountryCodes"]),
    queryFn: () => countryCodesApi.getCountryCodes(),
    select: mapCountryCodes,
    staleTime: CACHE_DURATION_1DAY,
    gcTime: CACHE_DURATION_1DAY,
  });
}
