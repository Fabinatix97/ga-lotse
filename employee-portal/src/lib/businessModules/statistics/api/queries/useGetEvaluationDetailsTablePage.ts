/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetEvaluationRequest } from "@eshg/employee-portal-api/statistics";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useEvaluationApi,
  useFilterTemplateApi,
} from "@/lib/businessModules/statistics/api/clients";
import { createQueryGetEvaluation } from "@/lib/businessModules/statistics/api/queries/useGetEvaluation";
import { createQueryGetFilterTemplates } from "@/lib/businessModules/statistics/api/queries/useGetFilterTemplates";

export function useGetEvaluationDetailsTablePage(
  evaluationRequest: GetEvaluationRequest,
  evaluationId: string,
) {
  const evaluationApi = useEvaluationApi();
  const filterTemplateApi = useFilterTemplateApi();
  const [{ data: evaluation }, { data: filterTemplates }] = useSuspenseQueries({
    queries: [
      createQueryGetEvaluation(evaluationApi, evaluationRequest),
      createQueryGetFilterTemplates(filterTemplateApi, evaluationId),
    ],
  });
  return { evaluation, filterTemplates };
}
