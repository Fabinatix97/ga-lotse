/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FacilityApi,
  GetPendingFacilitiesRequest,
} from "@eshg/employee-portal-api/inspection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useFacilityApi } from "@/lib/businessModules/inspection/api/clients";
import { facilityApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";
import { PendingFacilitiesFilters } from "@/lib/businessModules/inspection/shared/types";

export function getPendingFacilitiesQuery(
  facilityApi: FacilityApi,
  filters: PendingFacilitiesFilters,
) {
  const req = facilitiesFiltersToApi(filters);
  return queryOptions({
    queryKey: facilityApiQueryKey(["getPendingFacilities", { req }]),
    queryFn: () =>
      facilityApi.getPendingFacilitiesRaw(req).then(unwrapRawResponse),
  });
}

export function useGetPendingFacilities(filters: PendingFacilitiesFilters) {
  const facilityApi = useFacilityApi();
  return useSuspenseQuery(getPendingFacilitiesQuery(facilityApi, filters));
}

export function useGetFacilityHistory(
  inspectionId: string,
  facilityId: string,
) {
  const facilityApi = useFacilityApi();

  return useSuspenseQuery({
    queryKey: facilityApiQueryKey([
      "getFacilityHistory",
      { inspectionId, facilityId },
    ]),
    queryFn: () =>
      facilityApi.getFacilityHistory(
        facilityId,
        getHeadersForOfflineCaching(inspectionId),
      ),
  });
}

function facilitiesFiltersToApi(
  filters: PendingFacilitiesFilters,
): GetPendingFacilitiesRequest {
  const {
    sortField,
    sortDirection: filterSortDirection,
    isBefore,
    isAfter,
    ...rest
  } = filters;

  // For historical reasons, getPendingFacilities() accepts a different sort parameter
  // then is used in table filters. We must change the table params sortDirection/sortField
  // to a sort string:
  const sortDirection = filterSortDirection?.toLowerCase() ?? "asc";
  const sort = sortField ? [`${sortField}|${sortDirection}`] : undefined;

  return {
    ...rest,
    sort,
    // The API client expects Date objects...
    //  which it then immediately converts back to strings :)
    isBefore: isBefore ? new Date(isBefore) : undefined,
    isAfter: isAfter ? new Date(isAfter) : undefined,
  };
}
