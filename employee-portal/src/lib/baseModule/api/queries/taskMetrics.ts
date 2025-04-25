/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { GetTaskMetricsRequest } from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";

import { useTaskMetricsApi } from "@/lib/baseModule/api/clients";

import { taskMetricsApiQueryKey } from "./apiQueryKey";

export function useTaskMetricsQuery(request: GetTaskMetricsRequest) {
  const taskMetricsApi = useTaskMetricsApi();
  const queryResult = useSuspenseQuery({
    queryKey: taskMetricsApiQueryKey(["getTaskMetricsRaw", request]),
    queryFn: () =>
      taskMetricsApi.getTaskMetricsRaw(request).then(unwrapRawResponse),
  });
  return queryResult.data;
}
