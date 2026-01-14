/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal";
import { GeoShapeApi, GetGeoShapesRequest } from "@eshg/statistics-api";

import { useGeoShapeApi } from "@/lib/businessModules/statistics/api/clients";
import { mapGetGeoShapesResponseToTableView } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";

import { geoShapeApiQueryKey } from "./apiQueryKeys";

export function createQueryGetGeoShapes(
  geoShapeApi: GeoShapeApi,
  getGeoShapesRequest: GetGeoShapesRequest,
) {
  return {
    queryKey: geoShapeApiQueryKey(["getGeoShapes", getGeoShapesRequest]),
    queryFn: () =>
      geoShapeApi.getGeoShapesRaw(getGeoShapesRequest).then(unwrapRawResponse),
    select: mapGetGeoShapesResponseToTableView,
  };
}

export function useGetGeoShapes(getGeoShapesRequest: GetGeoShapesRequest) {
  const geoShapeApi = useGeoShapeApi();
  const query = useSuspenseQuery(
    createQueryGetGeoShapes(geoShapeApi, getGeoShapesRequest),
  );
  return query.data;
}
