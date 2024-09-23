/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { useQuery } from "@tanstack/react-query";

import { useStreetApi } from "@/lib/baseModule/api/clients";
import { baseApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

const streetApiQueryKey = queryKeyFactory(baseApiQueryKey(["street-api"]));

export function useAutocompleteStreetQuery(
  { street }: { street: string },
  { enabled }: { enabled: boolean },
) {
  const streetApi = useStreetApi();

  return useQuery({
    queryFn: async ({ signal }) => {
      return await streetApi.autocompleteStreet(street, { signal });
    },
    queryKey: streetApiQueryKey(["autocompleteStreet", street]),
    enabled,
    gcTime: 60000, // 1 minute cache
    staleTime: 60000,
  });
}
