/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBusinessDataAttributeWithName,
  ApiExpectedEvaluationTemplate,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { EvaluationDetails } from "@/lib/businessModules/statistics/api/models/evaluationDetails";
import { evaluationTemplateApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { getAttributeLabel } from "@/lib/businessModules/statistics/components/evaluations/getAttributeLabel";

export function mapToAttributeLabels(
  dataAttributes: ApiBusinessDataAttributeWithName[],
): string[] {
  return dataAttributes.flatMap((it) => {
    if (it.baseDataAttributes.length === 0) {
      return [getAttributeLabel(it)];
    }
    return it.baseDataAttributes.map((bAttr) => getAttributeLabel(it, bAttr));
  });
}

export function mapToEvaluationDetails(
  result: ApiExpectedEvaluationTemplate,
): EvaluationDetails {
  return {
    dataSourceName: result.dataSources[0]!.dataSourceName,
    attributeLabels: mapToAttributeLabels(
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
