/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetFilterTemplatesForEvaluationResponse,
  FilterTemplateApi,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useFilterTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { filterTemplateApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { FilterTemplate } from "@/lib/shared/components/filterSettings/FilterTemplates";

export function createQueryGetFilterTemplates(
  api: FilterTemplateApi,
  evaluationId: string,
) {
  return {
    queryKey: filterTemplateApiQueryKey([
      api.findFilterTemplatesForEvaluation.name,
      evaluationId,
    ]),
    queryFn: () => api.findFilterTemplatesForEvaluation(evaluationId),
    select: (result: ApiGetFilterTemplatesForEvaluationResponse) =>
      result.filterTemplateIdAndNames.map(
        (it) =>
          ({
            id: it.id,
            name: it.name,
          }) satisfies FilterTemplate,
      ),
  };
}

export function useGetFilterTemplates(evaluationId: string) {
  const api = useFilterTemplateApi();
  const query = useSuspenseQuery(
    createQueryGetFilterTemplates(api, evaluationId),
  );
  return query.data;
}
