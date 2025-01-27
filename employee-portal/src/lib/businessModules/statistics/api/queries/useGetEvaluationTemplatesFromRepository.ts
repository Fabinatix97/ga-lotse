/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetEvaluationTemplatesFromRepositoryResponse } from "@eshg/statistics-api";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useCentralRepositoryApi } from "@/lib/businessModules/statistics/api/clients";
import { EvaluationTemplateFromRepository } from "@/lib/businessModules/statistics/api/models/evaluationTemplatesOverview";

import { statisticsCentralRepositoryApiQueryKey } from "./apiQueryKeys";

export function mapEvaluationTemplatesFromRepositoryToTableView(
  response: ApiGetEvaluationTemplatesFromRepositoryResponse,
): EvaluationTemplateFromRepository[] {
  return response.evaluationTemplates.map((template) => {
    return {
      dataSourceName: template.dataSourceNames,
      createdAt: template.repositoryMetaInfo.createdAt,
      id: `${template.repositoryMetaInfo.id}`,
      name: template.repositoryMetaInfo.name,
      origin: template.repositoryMetaInfo.createdBy,
      version: template.repositoryMetaInfo.version,
    };
  });
}

export function useGetEvaluationTemplatesFromRepository() {
  const centralRepositoryApi = useCentralRepositoryApi();
  const queryResult = useSuspenseQuery({
    queryKey: statisticsCentralRepositoryApiQueryKey([
      "getEvaluationTemplatesFromRepository",
    ]),
    queryFn: () => centralRepositoryApi.getEvaluationTemplatesFromRepository(),
    select: mapEvaluationTemplatesFromRepositoryToTableView,
  });
  return queryResult.data;
}
