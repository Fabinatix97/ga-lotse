/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEvaluationTemplate } from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { mapAttributesToLabels } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToLabels";
import { mapDataSourceSensitivityApiToFrontend } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { EvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/models/evaluationTemplateDetails";
import { evaluationTemplateApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";

export function mapToEvaluationTemplateDetails(
  result: ApiEvaluationTemplate,
): EvaluationTemplateDetails {
  return {
    name: result.name,
    description: result.description,
    dataSourceName: result.dataSources[0]!.dataSourceName,
    dataSourceSensitivity: mapDataSourceSensitivityApiToFrontend(
      result.templateSensitivityInfo.sensitivity,
    ),
    createdAt: result.createdAt,
    user: result.user,
    attributeLabels: mapAttributesToLabels(
      result.dataSources[0]!.dataAttributes,
    ),
    analyses: result.analysisInfos.map((it) => ({
      name: it.name,
      diagramTitles: it.diagramTitles,
    })),
    withoutAnonymizationAllowed:
      result.templateSensitivityInfo.sensitiveDataAllowed,
  };
}

export function useGetEvaluationTemplateDetails(evaluationTemplateId: string) {
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const queryResult = useSuspenseQuery({
    queryFn: () =>
      evaluationTemplateApi.getEvaluationTemplate(evaluationTemplateId),
    select: mapToEvaluationTemplateDetails,
    queryKey: evaluationTemplateApiQueryKey([
      "getEvaluationTemplate",
      evaluationTemplateId,
    ]),
  });
  return queryResult.data;
}
