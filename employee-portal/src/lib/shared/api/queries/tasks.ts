/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetTaskByUserResponse,
  ApiResponse,
  GetTasksByAssigneeRequest,
} from "@eshg/employee-portal-api/businessProcedures";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export interface TeamviewFilters {
  assigneeId?: Set<string>;
}

interface UseFetchTasksForTeamViewTemplateProps {
  useTaskApi: () => {
    getTasksByAssigneeRaw: (
      request: GetTasksByAssigneeRequest,
      initOverrides?: RequestInit,
    ) => Promise<ApiResponse<ApiGetTaskByUserResponse>>;
  };
  queryKeyFactory: (
    queryKey: (string | Record<string, string> | string[])[],
  ) => readonly (string | Record<string, string> | string[])[];
  teamviewFilters: TeamviewFilters;
  getInitOverrides?: () => RequestInit;
}

export function useFetchTasksForTeamViewTemplateOptions({
  useTaskApi,
  queryKeyFactory,
  teamviewFilters,
  getInitOverrides,
}: UseFetchTasksForTeamViewTemplateProps) {
  const taskApi = useTaskApi();
  const searchParams = Object.fromEntries(useSearchParams().entries());
  return queryOptions({
    queryKey: queryKeyFactory([
      "fetchTasks",
      searchParams,
      Array.from(teamviewFilters.assigneeId ?? new Set()),
    ]),
    queryFn: async () => {
      return await taskApi
        .getTasksByAssigneeRaw(
          { assigneeId: teamviewFilters.assigneeId },
          getInitOverrides?.(),
        )
        .then(unwrapRawResponse);
    },
  });
}
