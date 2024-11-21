/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SearchIcd10CodesRequest } from "@eshg/employee-portal-api/schoolEntry";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useIcd10CodeApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function useSearchIcd10Codes(request: SearchIcd10CodesRequest) {
  const icd10CodeApi = useIcd10CodeApi();
  const enabled =
    (request.searchString?.length ?? 0) >= 1 ||
    (request.codes?.length ?? 0) > 0;
  return useQuery({
    queryKey: schoolEntryApiQueryKey(["searchIcd10Codes", request]),
    queryFn: () =>
      icd10CodeApi.searchIcd10CodesRaw(request).then(unwrapRawResponse),
    placeholderData: enabled ? keepPreviousData : undefined,
    enabled,
  });
}
