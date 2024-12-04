/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetEvaluationsResponse,
  EvaluationApi,
  GetEvaluationsRequest,
} from "@eshg/employee-portal-api/statistics";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import {
  EvaluationOverview,
  EvaluationOverviewTableItem,
} from "@/lib/businessModules/statistics/api/models/evaluationOverview";

import { getEvaluationsQueryKey } from "./apiQueryKeys";

export function createQueryGetEvaluations(
  evaluationApi: EvaluationApi,
  evaluationsRequest: GetEvaluationsRequest,
) {
  return {
    queryKey: getEvaluationsQueryKey([evaluationsRequest]),
    queryFn: () =>
      evaluationApi
        .getEvaluationsRaw(evaluationsRequest)
        .then(unwrapRawResponse),
    select: mapGetEvaluations,
  };
}

export function useGetEvaluations(evaluationsRequest: GetEvaluationsRequest) {
  const evaluationApi = useEvaluationApi();
  return useSuspenseQuery(
    createQueryGetEvaluations(evaluationApi, evaluationsRequest),
  );
}

function mapGetEvaluations(
  apiGetEvaluationsResponse: ApiGetEvaluationsResponse,
): EvaluationOverview {
  return {
    totalNumberOfElements: apiGetEvaluationsResponse.totalNumberOfElements,
    data: apiGetEvaluationsResponse.evaluations.map(
      (evaluation) =>
        ({
          ...evaluation,
          timeRangeEnd: mapTimeRangeEndApiToFrontend(evaluation.timeRangeEnd),
          user: apiGetEvaluationsResponse.resolvedUsers[evaluation.userId],
          dataSourceName: evaluation.dataSourceNames[0]!,
          anonymized: evaluation.anonymized,
          tooMuchDataForExport: evaluation.tooMuchDataForExport,
        }) satisfies EvaluationOverviewTableItem,
    ),
  };
}
