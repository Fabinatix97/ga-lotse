/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEvaluationTemplateDetailsFromRepository } from "@eshg/statistics-api";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useCentralRepositoryApi } from "@/lib/businessModules/statistics/api/clients";
import { mapAttributesToLabels } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToLabels";
import { EvaluationTemplateDetailsFromRepository } from "@/lib/businessModules/statistics/api/models/evaluationTemplateDetails";

import { statisticsCentralRepositoryApiQueryKey } from "./apiQueryKeys";

export function mapEvaluationTemplateFromRepositoryToTableView(
  response: ApiEvaluationTemplateDetailsFromRepository,
): EvaluationTemplateDetailsFromRepository {
  return {
    name: response.repositoryMetaInfo.name,
    description: response.repositoryMetaInfo.description,
    contact: response.repositoryMetaInfo.contact,
    origin: response.repositoryMetaInfo.createdBy,
    createdAt: response.repositoryMetaInfo.createdAt,
    dataSourceName: response.dataSources[0]!.dataSourceName,
    attributeLabels: mapAttributesToLabels(
      response.dataSources[0]!.dataAttributes,
    ),
    analyses: response.analysisInfos.map((it) => ({
      name: it.name,
      diagramTitles: it.diagramTitles,
    })),
  };
}

export function useGetEvaluationTemplateFromRepository(
  evaluationTemplateId: number,
  evaluationTemplateVersion: number,
) {
  const centralRepositoryApi = useCentralRepositoryApi();
  const queryResult = useSuspenseQuery({
    queryKey: statisticsCentralRepositoryApiQueryKey([
      "getEvaluationTemplateFromRepository",
      evaluationTemplateId,
      evaluationTemplateVersion,
    ]),
    queryFn: () =>
      centralRepositoryApi.getEvaluationTemplateFromRepository(
        evaluationTemplateId,
        evaluationTemplateVersion,
      ),
    select: mapEvaluationTemplateFromRepositoryToTableView,
  });
  return queryResult.data;
}
