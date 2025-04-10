/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery } from "@tanstack/react-query";

import { streetApiQueryKey } from "@/config/apiQueryKeys";
import { useApi } from "@/contexts/api";

export function useAutocompleteStreetQuery(
  { street }: { street: string },
  { enabled }: { enabled: boolean },
) {
  const { streetApi } = useApi();

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

export function useGetPostCodeAndCityForStreet(
  { street }: { street?: string },
  { enabled }: { enabled: boolean },
) {
  const { streetApi } = useApi();

  return useQuery({
    queryFn: async ({ signal }) => {
      if (street) {
        return await streetApi.getPostCodeAndCityForStreet(street, { signal });
      } else {
        return {
          city: null,
          postCode: null,
        };
      }
    },
    queryKey: streetApiQueryKey(["getPostCodeAndCityForStreet", street]),
    enabled,
    gcTime: 60000, // 1 minute cache
    staleTime: 60000,
  });
}
