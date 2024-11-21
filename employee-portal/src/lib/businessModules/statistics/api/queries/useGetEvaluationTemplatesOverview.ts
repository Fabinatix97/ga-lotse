/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEvaluationTemplateSortKey,
  ApiGetEvaluationTemplatesResponse,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import {
  EvaluationTemplateTableView,
  EvaluationTemplateWithUserInfo,
} from "@/lib/businessModules/statistics/api/models/evaluationTemplatesOverview";
import {
  PageRequest,
  mapPageRequest,
} from "@/lib/businessModules/statistics/api/models/pageRequest";

import { evaluationTemplateApiQueryKey } from "./apiQueryKeys";

export function mapToEvaluationTemplatesToTableView(
  response: ApiGetEvaluationTemplatesResponse,
): EvaluationTemplateTableView {
  const templates = response.evaluationTemplates.map((template) => {
    return {
      analysisCount: template.analysisCount,
      dataSourceName: template.dataSourceNames[0]!,
      createdAt: template.createdAt,
      id: template.id,
      name: template.name,
      userId: template.userId,
      user: response.resolvedUsers[template.userId],
    } satisfies EvaluationTemplateWithUserInfo;
  });
  return {
    totalNumberOfElements: response.totalNumberOfElements,
    evaluationTemplates: templates,
  };
}

export function mapPageRequestSortKey(key: string | undefined) {
  switch (key) {
    case "name":
      return ApiEvaluationTemplateSortKey.Name;
    case "createdAt":
      return ApiEvaluationTemplateSortKey.CreatedAt;
    default:
      return undefined;
  }
}

export function useGetEvaluationTemplatesOverview(
  evaluationTemplatesOverviewRequest: PageRequest,
) {
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const queryResult = useSuspenseQuery({
    queryKey: evaluationTemplateApiQueryKey([
      "getEvaluationTemplateOverview",
      evaluationTemplatesOverviewRequest,
    ]),
    queryFn: () =>
      evaluationTemplateApi.getEvaluationTemplateOverview(
        mapPageRequest(
          evaluationTemplatesOverviewRequest,
          mapPageRequestSortKey,
        ),
      ),
    select: mapToEvaluationTemplatesToTableView,
  });
  return queryResult.data;
}
