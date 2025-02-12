/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { EvaluationApi, GetEvaluationRequest } from "@eshg/statistics-api";
import { queryOptions } from "@tanstack/react-query";

import { mapEvaluationToTableView } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableView";

import { evaluationApiQueryKey } from "./apiQueryKeys";

export function createQueryGetEvaluation(
  evaluationApi: EvaluationApi,
  evaluationRequest: GetEvaluationRequest,
) {
  return queryOptions({
    queryKey: evaluationApiQueryKey(["getEvaluation", evaluationRequest]),
    queryFn: () =>
      evaluationApi.getEvaluationRaw(evaluationRequest).then(unwrapRawResponse),
    select: mapEvaluationToTableView,
  });
}
