/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";
import { SchoolEntryCountryCodesApi } from "@eshg/school-entry-api";

import { mapCountryCodes } from "@/lib/businessModules/schoolEntry/api/models/CountryCodes";
import { countryCodesApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function getCountryCodesQuery(
  countryCodesApi: SchoolEntryCountryCodesApi,
) {
  return queryOptions({
    ...STATIC_QUERY_OPTIONS,
    queryKey: countryCodesApiQueryKey(["getCountryCodes"]),
    queryFn: () => countryCodesApi.getCountryCodes(),
    select: mapCountryCodes,
  });
}
