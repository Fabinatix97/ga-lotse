/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetStatisticsSchemesResponse,
  StatisticsSchemeApi,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useStatisticsSchemeApi } from "@/lib/businessModules/statistics/api/clients";

import { statisticsSchemeApiQueryKey } from "./apiQueryKeys";

export function createQueryGetStatisticsSchemes(
  statisticsSchemeApi: StatisticsSchemeApi,
) {
  return {
    queryKey: statisticsSchemeApiQueryKey(["getStatisticsSchemes"]),
    queryFn: () => statisticsSchemeApi.getStatisticsSchemes(),
    select: (data: ApiGetStatisticsSchemesResponse) => data.statisticsSchemes,
  };
}

export function useGetStatisticsSchemes() {
  const statisticsSchemeApi = useStatisticsSchemeApi();
  return useSuspenseQuery(createQueryGetStatisticsSchemes(statisticsSchemeApi));
}
