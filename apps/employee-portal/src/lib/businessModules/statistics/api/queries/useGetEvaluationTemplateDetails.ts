/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiEvaluationTemplate } from "@eshg/statistics-api";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { mapAttributesToLabels } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToLabels";
import { mapToAnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { EvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/models/evaluationTemplateDetails";
import { evaluationTemplateApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import {
  mapTemplateDataSourceSensitivityApiToFrontend,
  userMayCreateEvaluationFromTemplate,
} from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplatesOverview";

export function mapToEvaluationTemplateDetails(
  result: ApiEvaluationTemplate,
): EvaluationTemplateDetails {
  return {
    name: result.name,
    description: result.description,
    dataSourceName: result.dataSources[0]!.dataSourceName,
    dataSourceSensitivity: mapTemplateDataSourceSensitivityApiToFrontend(
      result.templateSensitivityInfo.sensitivity,
    ),
    userMayCreateEvaluation: userMayCreateEvaluationFromTemplate(
      result.templateSensitivityInfo.sensitivity,
      result.templateSensitivityInfo.sensitiveDataAllowed,
      result.templateSensitivityInfo.canBeAnonymized,
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
    anonymizationOptions: mapToAnonymizationOptions({
      canBeAnonymized: result.templateSensitivityInfo.canBeAnonymized,
      dataSourceSensitivity: result.templateSensitivityInfo.sensitivity,
      sensitiveDataAllowed: result.templateSensitivityInfo.sensitiveDataAllowed,
      tooManyQuasiIdentifyingAttributes:
        result.dataSources[0]!.dataAttributes.flatMap((it) => [
          it.dataPrivacyCategory,
          ...it.baseDataAttributes.map((bIt) => bIt.dataPrivacyCategory),
        ]).filter((it) => it === "QUASI_IDENTIFYING").length > 5,
    }),
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
