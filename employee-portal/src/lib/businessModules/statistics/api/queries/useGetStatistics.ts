/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetEvaluationsResponse,
  EvaluationApi,
  GetEvaluationsRequest,
} from "@eshg/employee-portal-api/statistics";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";
import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import { StatisticOverview } from "@/lib/businessModules/statistics/api/models/statisticOverview";

import { getStatisticsQueryKey } from "./apiQueryKeys";

export function createQueryGetStatistics(
  statisticApi: EvaluationApi,
  statisticsRequest: GetEvaluationsRequest,
) {
  return {
    queryKey: getStatisticsQueryKey([statisticsRequest]),
    queryFn: () =>
      statisticApi.getEvaluationsRaw(statisticsRequest).then(unwrapRawResponse),
    select: mapGetStatistics,
  };
}

export function useGetStatistics(statisticsRequest: GetEvaluationsRequest) {
  const statisticApi = useStatisticApi();
  return useSuspenseQuery(
    createQueryGetStatistics(statisticApi, statisticsRequest),
  );
}

function mapGetStatistics(
  apiGetStatisticsResponse: ApiGetEvaluationsResponse,
): StatisticOverview {
  return {
    totalNumberOfElements: apiGetStatisticsResponse.totalNumberOfElements,
    data: apiGetStatisticsResponse.evaluations.map((statistic) => ({
      ...statistic,
      timeRangeEnd: mapTimeRangeEndApiToFrontend(statistic.timeRangeEnd),
      user: apiGetStatisticsResponse.resolvedUsers[statistic.userId],
      dataSourceName: statistic.dataSourceNames[0]!,
      anonymized: statistic.anonymized,
    })),
  };
}
