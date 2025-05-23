/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { SearchIcd10CodesRequest } from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal";

import { useIcd10CodeApi } from "@/lib/baseModule/api/clients";
import { baseApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useSearchIcd10Codes(request: SearchIcd10CodesRequest) {
  const icd10CodeApi = useIcd10CodeApi();
  const enabled =
    (request.searchString?.length ?? 0) >= 1 ||
    (request.codes?.length ?? 0) > 0;
  return useQuery({
    queryKey: baseApiQueryKey(["searchIcd10Codes", request]),
    queryFn: () =>
      icd10CodeApi.searchIcd10CodesRaw(request).then(unwrapRawResponse),
    placeholderData: enabled ? keepPreviousData : undefined,
    enabled,
  });
}
