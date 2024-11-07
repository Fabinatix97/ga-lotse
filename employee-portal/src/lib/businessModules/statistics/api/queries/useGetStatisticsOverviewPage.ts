/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetStatisticsRequest } from "@eshg/employee-portal-api/statistics";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useDataSourceApi,
  useEvaluationTemplateApi,
  useStatisticApi,
} from "@/lib/businessModules/statistics/api/clients";
import { createQueryGetAvailableDataSources } from "@/lib/businessModules/statistics/api/queries/useGetAvailableDataSources";
import { createQueryGetEvaluationTemplates } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplates";
import { createQueryGetStatistics } from "@/lib/businessModules/statistics/api/queries/useGetStatistics";

export function useGetStatisticsOverviewPage(
  statisticsRequest: GetStatisticsRequest,
) {
  const statisticApi = useStatisticApi();
  const dataSourceApi = useDataSourceApi();
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const [
    { data: statisticsOverview, isFetching: statisticsOverviewIsFetching },
    { data: availableDataSources },
    { data: evaluationTemplates },
  ] = useSuspenseQueries({
    queries: [
      createQueryGetStatistics(statisticApi, statisticsRequest),
      createQueryGetAvailableDataSources(dataSourceApi),
      createQueryGetEvaluationTemplates(evaluationTemplateApi),
    ],
  });

  return {
    statisticsOverview,
    statisticsOverviewIsFetching,
    availableDataSources,
    evaluationTemplates,
  };
}
