/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { AggregateProcedureMetricsRequest } from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal";

import { useProcedureAggregationApi } from "@/lib/baseModule/api/clients";

import { procedureApiQueryKey } from "./apiQueryKey";

export function useFetchProceduresForDashboardQuery() {
  const procedureApi = useProcedureAggregationApi();
  return useSuspenseQuery({
    queryKey: procedureApiQueryKey(["aggregateSelfRecentProcedures"]),
    queryFn: () =>
      procedureApi
        .aggregateSelfRecentProceduresRaw({
          limit: 10,
        })
        .then(unwrapRawResponse)
        .then((value) => value.procedures),
  });
}

export function useAggregateProcedureMetricsQuery(
  request: AggregateProcedureMetricsRequest,
) {
  const procedureApi = useProcedureAggregationApi();
  return useSuspenseQuery({
    queryKey: procedureApiQueryKey(["aggregateProcedureMetricsRaw", request]),
    queryFn: () =>
      procedureApi
        .aggregateProcedureMetricsRaw(request)
        .then(unwrapRawResponse)
        .then((value) => value.procedureMetrics),
  });
}
