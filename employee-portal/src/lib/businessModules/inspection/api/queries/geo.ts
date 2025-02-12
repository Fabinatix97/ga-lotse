/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InspectionGeoApi } from "@eshg/inspection-api";
import { QueryClient } from "@tanstack/react-query";

import { inspectionGeoApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function getReverseGeoCodeQueryKey(
  city: string,
  country: string,
  street: string,
  postalcode: string,
) {
  return inspectionGeoApiQueryKey([
    "getReverseGeoCode",
    city,
    country,
    street,
    postalcode,
  ]);
}

export function getReverseGeoCode(
  inspectionGeoApi: InspectionGeoApi,
  queryClient: QueryClient,
  country: string,
  city: string,
  postalcode: string,
  street: string,
) {
  return queryClient.fetchQuery({
    queryKey: getReverseGeoCodeQueryKey(country, city, postalcode, street),
    queryFn: () =>
      inspectionGeoApi.getReverseGeoCode(country, city, postalcode, street),
  });
}
