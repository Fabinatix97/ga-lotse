/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetStatisticsRequest } from "@eshg/employee-portal-api/statistics";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useDataSourceApi,
  useStatisticApi,
  useStatisticsSchemeApi,
} from "@/lib/businessModules/statistics/api/clients";
import { createQueryGetAvailableDataSources } from "@/lib/businessModules/statistics/api/queries/useGetAvailableDataSources";
import { createQueryGetStatistics } from "@/lib/businessModules/statistics/api/queries/useGetStatistics";
import { createQueryGetStatisticsSchemes } from "@/lib/businessModules/statistics/api/queries/useGetStatisticsSchemes";

export function useGetStatisticsOverviewPage(
  statisticsRequest: GetStatisticsRequest,
) {
  const statisticApi = useStatisticApi();
  const dataSourceApi = useDataSourceApi();
  const statisticsSchemeApi = useStatisticsSchemeApi();
  const [
    { data: statistics, isFetching: statisticsIsFetching },
    { data: availableDataSources },
    { data: statisticsSchemes },
  ] = useSuspenseQueries({
    queries: [
      createQueryGetStatistics(statisticApi, statisticsRequest),
      createQueryGetAvailableDataSources(dataSourceApi),
      createQueryGetStatisticsSchemes(statisticsSchemeApi),
    ],
  });

  return {
    statistics,
    statisticsIsFetching,
    availableDataSources,
    statisticsSchemes,
  };
}
