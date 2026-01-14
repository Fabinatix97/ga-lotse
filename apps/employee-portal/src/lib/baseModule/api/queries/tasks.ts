/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  AggregateTasksRequest,
  ApiBusinessModule,
  ApiGetTasksSortBy,
  ApiGetTasksSortOrder,
  ApiGetTasksSortOrderFromJSON,
  ApiTaskStatus,
  ApiTaskType,
  ApiUser,
} from "@eshg/base-api";
import { queryKeyFactory, unwrapRawResponse } from "@eshg/lib-portal";

import { useTaskAggregationApi } from "@/lib/baseModule/api/clients";
import { mapResponse } from "@/lib/baseModule/api/models/task";
import { baseApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";
import { FetchTaskForOverviewSearchParamsSchema } from "@/lib/baseModule/api/schemas/tasks";

const taskApiQueryKey = queryKeyFactory(baseApiQueryKey(["task-api"]));

export interface AggregateTaskFilters {
  assignedById?: Set<string>;
  businessModule?: Set<ApiBusinessModule>;
  taskType?: Set<ApiTaskType>;
  taskStatus?: Set<ApiTaskStatus>;
}

export function useFetchTasksForOverviewQueryOptions(
  selfUser: ApiUser,
  filter: AggregateTaskFilters,
  searchParams: FetchTaskForOverviewSearchParamsSchema,
) {
  const taskApi = useTaskAggregationApi();

  const sortBy =
    searchParams.sortField === "dueAt"
      ? ApiGetTasksSortBy.Priority
      : ApiGetTasksSortBy.CreatedAt;
  const sortOrder = searchParams.sortDirection
    ? ApiGetTasksSortOrderFromJSON(searchParams.sortDirection.toUpperCase())
    : ApiGetTasksSortOrder.Desc;

  const request: AggregateTasksRequest = {
    assigneeId: selfUser.userId,
    assignedById: filter.assignedById,
    businessModule: filter.businessModule,
    taskType: filter.taskType,
    taskStatus: filter.taskStatus,
    sortBy: sortBy,
    sortOrder: sortOrder,
    pageSize: searchParams.pageSize ?? 25,
    pageNumber: searchParams.pageNumber ?? 0,
  };

  return queryOptions({
    queryKey: taskApiQueryKey([
      "getAggregatedTasks",
      request,
      Array.from(request.businessModule ?? new Set()),
      Array.from(request.assignedById ?? new Set()),
      Array.from(request.taskType ?? new Set()),
      Array.from(request.taskStatus ?? new Set()),
    ]),
    queryFn: () => taskApi.aggregateTasksRaw(request).then(unwrapRawResponse),
    select: mapResponse,
  });
}

export function useFetchTasksForDashboardQuery() {
  const taskApi = useTaskAggregationApi();
  return useSuspenseQuery({
    queryKey: taskApiQueryKey(["aggregateTasksForDashboard"]),
    queryFn: () => taskApi.aggregateTasksForDashboard(),
    select: (response) => response.tasks,
  });
}
