/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

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
import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useTaskAggregationApi } from "@/lib/baseModule/api/clients";
import { mapResponse } from "@/lib/baseModule/api/models/task";
import { baseApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

const taskApiQueryKey = queryKeyFactory(baseApiQueryKey(["task-api"]));

export interface AggregateTaskFilters {
  assignedById?: Set<string>;
  businessModule?: Set<ApiBusinessModule>;
  taskType?: Set<ApiTaskType>;
  taskStatus?: Set<ApiTaskStatus>;
}

interface SearchParams {
  sortField?: string;
  sortDirection?: string;
  pageSize?: number;
  pageNumber?: number;
}

export function useFetchTasksForOverviewQueryOptions(
  selfUser: ApiUser,
  filter: AggregateTaskFilters,
  searchParams: SearchParams,
) {
  const taskApi = useTaskAggregationApi();

  const sortBy =
    searchParams.sortField === "dueAt"
      ? ApiGetTasksSortBy.Priority
      : ApiGetTasksSortBy.CreatedAt;
  const sortOrder = searchParams.sortDirection
    ? ApiGetTasksSortOrderFromJSON(searchParams.sortDirection.toUpperCase())
    : ApiGetTasksSortOrder.Desc;

  const limit = searchParams.pageSize ?? 25;
  const offset = searchParams.pageNumber ? limit * searchParams.pageNumber : 0;

  const request: AggregateTasksRequest = {
    assigneeId: selfUser.userId,
    assignedById: filter.assignedById,
    businessModule: filter.businessModule,
    taskType: filter.taskType,
    taskStatus: filter.taskStatus,
    sortBy: sortBy,
    sortOrder: sortOrder,
    limit: limit,
    offset: offset,
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
