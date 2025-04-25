/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiGetAllMinimalEvaluationTemplateInfosResponse,
  EvaluationTemplateApi,
} from "@eshg/statistics-api";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";

import { evaluationTemplateApiQueryKey } from "./apiQueryKeys";

export function createQueryGetEvaluationTemplates(
  evaluationTemplateApi: EvaluationTemplateApi,
) {
  return {
    queryKey: evaluationTemplateApiQueryKey(["getEvaluationTemplates"]),
    queryFn: () => evaluationTemplateApi.getAllMinimalEvaluationTemplateInfos(),
    select: (data: ApiGetAllMinimalEvaluationTemplateInfosResponse) =>
      data.minimalEvaluationTemplateInfos,
  };
}

export function useGetEvaluationTemplates() {
  const evaluationTemplateApi = useEvaluationTemplateApi();
  return useSuspenseQuery(
    createQueryGetEvaluationTemplates(evaluationTemplateApi),
  );
}
