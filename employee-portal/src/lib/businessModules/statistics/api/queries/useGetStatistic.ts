/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  EvaluationApi,
  GetEvaluationRequest,
} from "@eshg/employee-portal-api/statistics";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";
import { mapStatisticToTableView } from "@/lib/businessModules/statistics/api/models/statisticDetailsTableView";

import { statisticApiQueryKey } from "./apiQueryKeys";

export function createQueryGetStatistic(
  statisticApi: EvaluationApi,
  statisticRequest: GetEvaluationRequest,
) {
  return {
    queryKey: statisticApiQueryKey(["getStatistic", statisticRequest]),
    queryFn: () =>
      statisticApi.getEvaluationRaw(statisticRequest).then(unwrapRawResponse),
    select: mapStatisticToTableView,
  };
}

export function useGetStatistic(statisticRequest: GetEvaluationRequest) {
  const statisticApi = useStatisticApi();
  const queryResult = useSuspenseQuery(
    createQueryGetStatistic(statisticApi, statisticRequest),
  );
  return queryResult.data;
}
