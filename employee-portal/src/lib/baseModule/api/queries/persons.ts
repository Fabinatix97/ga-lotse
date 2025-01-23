/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SearchReferencePersonsRequest } from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { usePersonApi } from "@/lib/baseModule/api/clients";
import { personApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useSearchReferencePersonsQuery(
  request: SearchReferencePersonsRequest,
  options: { enabled: boolean },
) {
  const personApi = usePersonApi();

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

export function useGetPersonFileStateDiff(id: string) {
  const personApi = usePersonApi();
  return useSuspenseQuery({
    queryKey: personApiQueryKey(["getPersonFileStateDiff", id]),
    queryFn: () => personApi.getPersonDiff(id),
  });
}
