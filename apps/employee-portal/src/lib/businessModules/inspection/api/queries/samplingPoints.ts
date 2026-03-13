/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { SamplingPointApi } from "@eshg/inspection-api";
import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";

import { useSamplingPointApi } from "@/lib/businessModules/inspection/api/clients";
import { samplingPointsApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useGetSamplingPoints(namePrefix?: string, facilityId?: string) {
  const samplingPointApi = useSamplingPointApi();
  return useSuspenseQuery(
    getSamplingPointsQuery(samplingPointApi, namePrefix, facilityId),
  );
}

export function useGetSamplingPointsQuery(
  namePrefix?: string,
  facilityId?: string,
) {
  const samplingPointApi = useSamplingPointApi();

  return useQuery(
    getSamplingPointsQuery(samplingPointApi, namePrefix, facilityId),
  );
}

export function getSamplingPointsQuery(
  samplingPointApi: SamplingPointApi,
  namePrefix?: string,
  facilityId?: string,
) {
  return queryOptions({
    queryKey: samplingPointsApiQueryKey([
      "getSamplingPoints",
      namePrefix,
      facilityId,
    ]),
    queryFn: () => samplingPointApi.getSamplingPoints(namePrefix, facilityId),
    select: (response) => response.samplingPoints ?? [],
    // Enable long-time caching for this query, but do not make this query static,
    // i.e. don't disable the invalidation through mutation.
    gcTime: STATIC_QUERY_OPTIONS.gcTime,
    staleTime: STATIC_QUERY_OPTIONS.staleTime,
  });
}

export function useGetFacilities() {
  const samplingPointApi = useSamplingPointApi();
  return useSuspenseQuery(getFacilitiesQuery(samplingPointApi));
}

export function getFacilitiesQuery(samplingPointApi: SamplingPointApi) {
  return queryOptions({
    queryKey: samplingPointsApiQueryKey(["getFacilitiesForSamplingPoints"]),
    queryFn: () => samplingPointApi.getFacilities(),
    select: (response) => response.facilities ?? [],
    // Enable long-time caching for this query, but do not make this query static,
    // i.e. don't disable the invalidation through mutation.
    gcTime: STATIC_QUERY_OPTIONS.gcTime,
    staleTime: STATIC_QUERY_OPTIONS.staleTime,
  });
}
