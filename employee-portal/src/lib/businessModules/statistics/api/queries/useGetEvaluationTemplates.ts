/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetAllEvaluationTemplatesResponse,
  EvaluationTemplateApi,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";

import { evaluationTemplateApiQueryKey } from "./apiQueryKeys";

export function createQueryGetEvaluationTemplates(
  evaluationTemplateApi: EvaluationTemplateApi,
) {
  return {
    queryKey: evaluationTemplateApiQueryKey(["getEvaluationTemplates"]),
    queryFn: () => evaluationTemplateApi.getEvaluationTemplates(),
    select: (data: ApiGetAllEvaluationTemplatesResponse) =>
      data.evaluationTemplates,
  };
}

export function useGetEvaluationTemplates() {
  const evaluationTemplateApi = useEvaluationTemplateApi();
  return useSuspenseQuery(
    createQueryGetEvaluationTemplates(evaluationTemplateApi),
  );
}
