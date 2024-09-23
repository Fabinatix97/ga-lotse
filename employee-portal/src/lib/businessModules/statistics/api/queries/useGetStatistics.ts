/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetStatisticsResponse,
  GetStatisticsRequest,
  StatisticApi,
} from "@eshg/employee-portal-api/statistics";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";
import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";

import { getStatisticsQueryKey } from "./apiQueryKeys";

export function createQueryGetStatistics(
  statisticApi: StatisticApi,
  statisticsRequest: GetStatisticsRequest,
) {
  return {
    queryKey: getStatisticsQueryKey([statisticsRequest]),
    queryFn: () =>
      statisticApi.getStatisticsRaw(statisticsRequest).then(unwrapRawResponse),
    select: mapGetStatistics,
  };
}

export function useGetStatistics(statisticsRequest: GetStatisticsRequest) {
  const statisticApi = useStatisticApi();
  return useSuspenseQuery(
    createQueryGetStatistics(statisticApi, statisticsRequest),
  );
}

function mapGetStatistics(
  apiGetStatisticsResponse: ApiGetStatisticsResponse,
): ApiGetStatisticsResponse {
  return {
    ...apiGetStatisticsResponse,
    statistics: apiGetStatisticsResponse.statistics.map((statistic) => ({
      ...statistic,
      timeRangeEnd: mapTimeRangeEndApiToFrontend(statistic.timeRangeEnd),
    })),
  };
}
