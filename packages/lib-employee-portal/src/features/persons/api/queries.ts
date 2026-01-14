/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import {
  SearchReferenceFacilitiesRequest,
  SearchReferencePersonsRequest,
} from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal";

import {
  facilityApiQueryKey,
  personApiQueryKey,
} from "../../../config/apiQueryKeys";
import { useApi } from "../../../contexts/api";

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

export function useGetPersonFileStateDiff(id: string) {
  const { personApi } = useApi();
  return useSuspenseQuery({
    queryKey: personApiQueryKey(["getPersonFileStateDiff", id]),
    queryFn: () => personApi.getPersonDiff(id),
  });
}

export function useSearchReferenceFacilitiesQuery(
  request: SearchReferenceFacilitiesRequest,
  options: {
    enabled: boolean;
  },
) {
  const { facilityApi } = useApi();
  return useQuery({
    queryKey: facilityApiQueryKey(["searchReferenceFacilities", request]),
    queryFn: () =>
      facilityApi.searchReferenceFacilitiesRaw(request).then(unwrapRawResponse),
    enabled: options.enabled,
  });
}

export function useGetFacilityFileStateDiff(id: string) {
  const { facilityApi } = useApi();
  return useSuspenseQuery({
    queryKey: facilityApiQueryKey(["getFacilityFileStateDiff", id]),
    queryFn: () => facilityApi.getFacilityDiff(id),
  });
}
