/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEvaluationDataSensitivity,
  ApiEvaluationSortKey,
  ApiEvaluationState,
  ApiGetEvaluationsResponse,
  EvaluationApi,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { extractFilterValue } from "@/lib/businessModules/statistics/api/mapper/extractFilterValue";
import { mapDateSpanFilterToApiDateSpan } from "@/lib/businessModules/statistics/api/mapper/mapDateSpanFilterToApiDateSpan";
import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import {
  DataSourceSensitivity,
  mapEvaluationDataSourceSensitivityFrontendToApi,
} from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import {
  EvaluationOverview,
  EvaluationOverviewTableItem,
} from "@/lib/businessModules/statistics/api/models/evaluationOverview";
import {
  PageRequest,
  mapPageRequest,
} from "@/lib/businessModules/statistics/api/models/pageRequest";
import { EvaluationTableFilterKey } from "@/lib/businessModules/statistics/components/evaluations/filterDefinitions";
import { DateSpanFilterValue } from "@/lib/shared/components/filterSettings/models/DateSpanFilter";
import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

import { getEvaluationsQueryKey } from "./apiQueryKeys";

export function mapPageRequestWithFilterToApi(
  pageRequest: PageRequest,
  filterValues: FilterValue[],
) {
  const sensitivities = extractFilterValue<EnumFilterValue>(
    filterValues,
    EvaluationTableFilterKey.Sensitivity,
  )?.selectedValues?.map((it) =>
    mapEvaluationDataSourceSensitivityFrontendToApi(
      it as DataSourceSensitivity,
    ),
  );
  const dataSourceIds = extractFilterValue<EnumFilterValue>(
    filterValues,
    EvaluationTableFilterKey.DataSource,
  )?.selectedValues;
  const states = extractFilterValue<EnumFilterValue>(
    filterValues,
    EvaluationTableFilterKey.Status,
  )?.selectedValues as ApiEvaluationState[] | undefined;
  const startDateSpan = mapDateSpanFilterToApiDateSpan(
    extractFilterValue<DateSpanFilterValue>(
      filterValues,
      EvaluationTableFilterKey.DateRangeStart,
    ),
    false,
  );
  const endDateSpan = mapDateSpanFilterToApiDateSpan(
    extractFilterValue<DateSpanFilterValue>(
      filterValues,
      EvaluationTableFilterKey.DateRangeEnd,
    ),
    true,
  );

  const evaluationSortKey: Partial<
    Record<keyof EvaluationOverviewTableItem, ApiEvaluationSortKey>
  > = {
    name: "NAME",
    createdAt: "CREATED_AT",
    timeRangeStart: "TIME_RANGE_START",
    timeRangeEnd: "TIME_RANGE_END",
  };

  return {
    ...mapPageRequest(
      pageRequest,
      (sortKey) =>
        evaluationSortKey[sortKey as keyof EvaluationOverviewTableItem],
    ),
    filterOptions: {
      dataSourceIds: dataSourceIds,
      start: startDateSpan,
      dataSensitivities: sensitivities,
      end: endDateSpan,
      states: states,
    },
  };
}

export function createQueryGetEvaluations(
  evaluationApi: EvaluationApi,
  pageRequest: PageRequest,
  filterValues: FilterValue[],
) {
  return {
    queryKey: getEvaluationsQueryKey([
      "getEvaluations",
      pageRequest,
      filterValues,
    ]),
    queryFn: () =>
      evaluationApi.getEvaluations(
        mapPageRequestWithFilterToApi(pageRequest, filterValues),
      ),
    select: mapGetEvaluations,
  };
}

export function useGetEvaluations(
  pageRequest: PageRequest,
  filterValues: FilterValue[],
) {
  const evaluationApi = useEvaluationApi();
  return useSuspenseQuery(
    createQueryGetEvaluations(evaluationApi, pageRequest, filterValues),
  );
}

function mapGetEvaluations(
  apiGetEvaluationsResponse: ApiGetEvaluationsResponse,
): EvaluationOverview {
  return {
    totalNumberOfElements: apiGetEvaluationsResponse.totalNumberOfElements,
    data: apiGetEvaluationsResponse.evaluations.map(
      (evaluation) =>
        ({
          ...evaluation,
          timeRangeEnd: mapTimeRangeEndApiToFrontend(evaluation.timeRangeEnd),
          user: apiGetEvaluationsResponse.resolvedUsers[evaluation.userId],
          dataSourceName: evaluation.dataSourceNames[0]!,
          //TODO: Display sensitivity instead of anonymized
          anonymized:
            evaluation.dataSensitivity !==
            ApiEvaluationDataSensitivity.Sensitive,
          tooMuchDataForExport: evaluation.tooMuchDataForExport,
        }) satisfies EvaluationOverviewTableItem,
    ),
  };
}
