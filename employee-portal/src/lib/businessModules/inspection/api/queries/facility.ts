/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useFacilityApi } from "@/lib/businessModules/inspection/api/clients";
import { facilityApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { PendingFacilitiesFilters } from "@/lib/businessModules/inspection/shared/types";

export function useGetFacility(facilityId: string) {
  const facilityApi = useFacilityApi();
  return useSuspenseQuery({
    queryKey: facilityApiQueryKey(["getFacility", { facilityId }]),
    queryFn: () => facilityApi.getFacility(facilityId),
  });
}

export function useGetPendingFacilities(filters: PendingFacilitiesFilters) {
  const facilityApi = useFacilityApi();

  // For historical reasons, getPendingFacilities() accepts a different sort parameter
  // then is used in table filters. We must change the table params sortDirection/sortField
  // to a sort string:
  const sortDirection = filters.sortDirection?.toLowerCase() ?? "asc";
  const sort = filters?.sortField
    ? [`${filters?.sortField}|${sortDirection}`]
    : undefined;
  const req = { ...filters, sort };
  delete req.sortField;
  delete req.sortDirection;

  return useSuspenseQuery({
    queryKey: facilityApiQueryKey(["getPendingFacilities", { req }]),
    queryFn: () =>
      facilityApi.getPendingFacilitiesRaw(req).then(unwrapRawResponse),
  });
}
