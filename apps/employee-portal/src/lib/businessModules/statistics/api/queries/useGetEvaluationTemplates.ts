/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetAllMinimalEvaluationTemplateInfosResponse,
  EvaluationTemplateApi,
} from "@eshg/statistics-api";

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
