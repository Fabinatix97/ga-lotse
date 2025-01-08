/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SearchReferenceFacilitiesRequest } from "@eshg/employee-portal-api/base";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useQuery } from "@tanstack/react-query";

import { useFacilityApi } from "@/lib/baseModule/api/clients";
import { facilityApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useSearchReferenceFacilitiesQuery(
  request: SearchReferenceFacilitiesRequest,
  options: {
    enabled: boolean;
  },
) {
  const facilityApi = useFacilityApi();

  return useQuery({
    queryKey: facilityApiQueryKey(["searchReferenceFacilities", request]),
    queryFn: () =>
      facilityApi.searchReferenceFacilitiesRaw(request).then(unwrapRawResponse),
    enabled: options.enabled,
  });
}
