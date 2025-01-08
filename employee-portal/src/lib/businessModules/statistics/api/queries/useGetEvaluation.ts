/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  EvaluationApi,
  GetEvaluationRequest,
} from "@eshg/employee-portal-api/statistics";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";

import { mapEvaluationToTableView } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableView";

import { evaluationApiQueryKey } from "./apiQueryKeys";

export function createQueryGetEvaluation(
  evaluationApi: EvaluationApi,
  evaluationRequest: GetEvaluationRequest,
) {
  return {
    queryKey: evaluationApiQueryKey(["getEvaluation", evaluationRequest]),
    queryFn: () =>
      evaluationApi.getEvaluationRaw(evaluationRequest).then(unwrapRawResponse),
    select: mapEvaluationToTableView,
  };
}
