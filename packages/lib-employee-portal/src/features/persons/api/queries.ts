/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchReferencePersonsRequest } from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useQuery } from "@tanstack/react-query";

import { personApiQueryKey } from "@/config/apiQueryKeys";
import { useApi } from "@/contexts/api";

export function useSearchReferencePersonsQuery(
  request: SearchReferencePersonsRequest,
  options: { enabled: boolean },
) {
  const { personApi } = useApi();

  return useQuery({
    queryKey: personApiQueryKey(["searchReferencePersons", request]),
    queryFn: async () => {
      return await personApi
        .searchReferencePersonsRaw(request)
        .then(unwrapRawResponse);
    },
    enabled: options.enabled,
  });
}
