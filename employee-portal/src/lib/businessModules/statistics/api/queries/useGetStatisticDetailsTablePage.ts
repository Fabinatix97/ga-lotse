/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetEvaluationRequest } from "@eshg/employee-portal-api/statistics";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useFilterTemplateApi,
  useStatisticApi,
} from "@/lib/businessModules/statistics/api/clients";
import { createQueryGetFilterTemplates } from "@/lib/businessModules/statistics/api/queries/useGetFilterTemplates";
import { createQueryGetStatistic } from "@/lib/businessModules/statistics/api/queries/useGetStatistic";

export function useGetStatisticDetailsTablePage(
  statisticRequest: GetEvaluationRequest,
  statisticId: string,
) {
  const statisticApi = useStatisticApi();
  const filterTemplateApi = useFilterTemplateApi();
  const [{ data: statistic }, { data: filterTemplates }] = useSuspenseQueries({
    queries: [
      createQueryGetStatistic(statisticApi, statisticRequest),
      createQueryGetFilterTemplates(filterTemplateApi, statisticId),
    ],
  });
  return { statistic, filterTemplates };
}
