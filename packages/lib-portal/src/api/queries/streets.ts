/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery } from "@tanstack/react-query";

import { PublicStreetApi, StreetApi } from "@eshg/base-api";

import { streetApiQueryKey } from "../../config/apiQueryKeys";

export type AnyStreetApi = PublicStreetApi | StreetApi;

function isPublicApi(api: AnyStreetApi): api is PublicStreetApi {
  return api instanceof PublicStreetApi;
}

export function useAutocompleteStreetQuery(
  streetApi: AnyStreetApi,
  { street }: { street: string },
  { enabled }: { enabled: boolean },
) {
  return useQuery({
    queryFn: async ({ signal }) => {
      return isPublicApi(streetApi)
        ? await streetApi.publicAutocompleteStreet(street, { signal })
        : await streetApi.autocompleteStreet(street, { signal });
    },
    queryKey: streetApiQueryKey(["autocompleteStreet", street, streetApi]),
    enabled,
    throwOnError: false,
    gcTime: 60000, // 1 minute cache
    staleTime: 60000,
  });
}

export function useGetPostalCodeAndCityForStreet(
  streetApi: AnyStreetApi,
  { street, houseNumber }: { street?: string; houseNumber?: string },
  { enabled }: { enabled: boolean },
) {
  return useQuery({
    queryFn: async ({ signal }) => {
      if (street) {
        return isPublicApi(streetApi)
          ? await streetApi.publicGetPostalCodeAndCityForStreet(
              street,
              houseNumber,
              { signal },
            )
          : await streetApi.getPostalCodeAndCityForStreet(street, houseNumber, {
              signal,
            });
      } else {
        return {
          city: null,
          postalCode: null,
        };
      }
    },
    queryKey: streetApiQueryKey([
      "getPostalCodeAndCityForStreet",
      street ?? "",
      houseNumber ?? "",
      streetApi,
    ]),
    enabled,
    throwOnError: false,
    gcTime: 60000, // 1 minute cache
    staleTime: 60000,
  });
}
