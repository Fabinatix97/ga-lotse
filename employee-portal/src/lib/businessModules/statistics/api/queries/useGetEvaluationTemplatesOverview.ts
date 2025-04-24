/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DateSpanFilterValue,
  EnumFilterValue,
  FilterValue,
} from "@eshg/lib-employee-portal";
import {
  ApiDataSourceSensitivity,
  ApiEvaluationTemplateSortKey,
  ApiGetEvaluationTemplatesResponse,
} from "@eshg/statistics-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { extractFilterValue } from "@/lib/businessModules/statistics/api/mapper/extractFilterValue";
import { mapDateSpanFilterToApiDateSpan } from "@/lib/businessModules/statistics/api/mapper/mapDateSpanFilterToApiDateSpan";
import {
  DataSourceSensitivity,
  mapDataSourceSensitivityApiToFrontend,
} from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import {
  EvaluationTemplateTableView,
  EvaluationTemplateWithUserInfo,
} from "@/lib/businessModules/statistics/api/models/evaluationTemplatesOverview";
import {
  PageRequest,
  mapPageRequest,
} from "@/lib/businessModules/statistics/api/models/pageRequest";
import { EvaluationTemplatesFilterKey } from "@/lib/businessModules/statistics/components/evaluations/templates/filterDefinitions";

import { evaluationTemplateApiQueryKey } from "./apiQueryKeys";

export function userMayCreateEvaluationFromTemplate(
  sensitivity: ApiDataSourceSensitivity | undefined,
  sensitiveDataAllowed: boolean,
  canBeAnonymized: boolean,
) {
  return !(
    sensitivity === ApiDataSourceSensitivity.Sensitive &&
    !sensitiveDataAllowed &&
    !canBeAnonymized
  );
}

export function mapTemplateDataSourceSensitivityApiToFrontend(
  apiDataSourceSensitivity: ApiDataSourceSensitivity | undefined,
): DataSourceSensitivity | undefined {
  if (isDefined(apiDataSourceSensitivity)) {
    return mapDataSourceSensitivityApiToFrontend(apiDataSourceSensitivity);
  }
  return undefined;
}

export function mapEvaluationTemplatesToTableView(
  response: ApiGetEvaluationTemplatesResponse,
): EvaluationTemplateTableView {
  const templates = response.evaluationTemplates.map((template) => {
    return {
      analysisCount: template.analysisCount,
      dataSourceName: template.dataSourceNames[0]!,
      dataSourceSensitivity: mapTemplateDataSourceSensitivityApiToFrontend(
        template.templateSensitivityInfo.sensitivity,
      ),
      userMayCreateEvaluation: userMayCreateEvaluationFromTemplate(
        template.templateSensitivityInfo.sensitivity,
        template.templateSensitivityInfo.sensitiveDataAllowed,
        template.templateSensitivityInfo.canBeAnonymized,
      ),
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

export function mapPageRequestWithFilterToApi(
  pageRequest: PageRequest,
  filterValues: FilterValue[],
) {
  const dataSourceIds = extractFilterValue<EnumFilterValue>(
    filterValues,
    EvaluationTemplatesFilterKey.DataSource,
  )?.selectedValues;
  const createdAt = mapDateSpanFilterToApiDateSpan(
    extractFilterValue<DateSpanFilterValue>(
      filterValues,
      EvaluationTemplatesFilterKey.CreatedAt,
    ),
    false,
  );

  return {
    ...mapPageRequest(pageRequest, mapPageRequestSortKey),
    filterOptions: {
      dataSourceIds: dataSourceIds,
      createdAt: createdAt,
    },
  };
}

export function useGetEvaluationTemplatesOverview(
  pageRequest: PageRequest,
  filterValues: FilterValue[],
) {
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const queryResult = useSuspenseQuery({
    queryKey: evaluationTemplateApiQueryKey([
      "getEvaluationTemplateOverview",
      pageRequest,
      filterValues,
    ]),
    queryFn: () =>
      evaluationTemplateApi.getEvaluationTemplateOverview(
        mapPageRequestWithFilterToApi(pageRequest, filterValues),
      ),
    select: mapEvaluationTemplatesToTableView,
  });
  return queryResult.data;
}
