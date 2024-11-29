/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetGeoShapesRequest } from "@eshg/employee-portal-api/statistics";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useEvaluationApi,
  useGeoShapeApi,
} from "@/lib/businessModules/statistics/api/clients";
import { createQueryGetDetailPageInformation } from "@/lib/businessModules/statistics/api/queries/useGetDetailPageInformation";
import { createQueryGetGeoShapes } from "@/lib/businessModules/statistics/api/queries/useGetGeoShapes";

export function useGetEvaluationDetailsPage(
  evaluationId: string,
  getGeoShapesRequest: GetGeoShapesRequest,
) {
  const evaluationApi = useEvaluationApi();
  const geoShapeApi = useGeoShapeApi();
  const [{ data: detailPageInformation }, { data: geoShapes }] =
    useSuspenseQueries({
      queries: [
        createQueryGetDetailPageInformation(evaluationApi, evaluationId),
        createQueryGetGeoShapes(geoShapeApi, getGeoShapesRequest),
      ],
    });
  return {
    detailPageInformation,
    geoShapes: geoShapes.geoShapes,
  };
}
