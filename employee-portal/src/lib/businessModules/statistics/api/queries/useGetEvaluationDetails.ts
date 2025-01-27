/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiExpectedEvaluationTemplate } from "@eshg/statistics-api";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { mapAttributesToLabels } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToLabels";
import { EvaluationDetails } from "@/lib/businessModules/statistics/api/models/evaluationDetails";
import { evaluationTemplateApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";

export function mapToEvaluationDetails(
  result: ApiExpectedEvaluationTemplate,
): EvaluationDetails {
  return {
    dataSourceName: result.dataSources[0]!.dataSourceName,
    attributeLabels: mapAttributesToLabels(
      result.dataSources[0]!.dataAttributes,
    ),
    analyses: result.analysisInfos.map((it) => ({
      name: it.name,
      diagramTitles: it.diagramTitles,
    })),
  };
}

export function useGetEvaluationDetails(
  evaluationId: string,
): EvaluationDetails {
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const queryResult = useSuspenseQuery({
    queryKey: evaluationTemplateApiQueryKey([
      "getTemplateInformation",
      evaluationId,
    ]),
    queryFn: () => evaluationTemplateApi.getTemplateInformation(evaluationId),
    select: mapToEvaluationDetails,
  });
  return queryResult.data;
}
