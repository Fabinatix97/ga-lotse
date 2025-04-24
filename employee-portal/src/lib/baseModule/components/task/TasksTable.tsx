/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTaskStatus } from "@eshg/base-api";
import {
  ButtonBar,
  DataTable,
  EnumFilterValue,
  FilterSettings,
  FilterSettingsSheet,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  useGetSelfUser,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import {
  AggregateTaskFilters,
  useFetchTasksForOverviewQueryOptions,
} from "@/lib/baseModule/api/queries/tasks";
import {
  useGetSelfGroupsQueryOptions,
  useGetSelfLeadersQueryOptions,
} from "@/lib/baseModule/api/queries/users";
import { FetchTaskForOverviewSearchParamsSchema } from "@/lib/baseModule/api/schemas/tasks";
import {
  FILTER_KEYS,
  useTaskTableFilterSettings,
} from "@/lib/baseModule/components/task/useTaskTableFilterSettings";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";

import { tasksColumns } from "./taskOverviewColumns";

const initialState = {
  initialFilters: { taskStatus: new Set([ApiTaskStatus.Open]) },
  initialFilterValues: [
    {
      type: "Enum",
      key: FILTER_KEYS.taskStatus,
      selectedValues: [ApiTaskStatus.Open],
    },
  ] as EnumFilterValue[],
};

interface TasksTableProps {
  searchParams: FetchTaskForOverviewSearchParamsSchema;
}

export function TasksTable(props: TasksTableProps) {
  const tableControl = useTableControl({ serverSideSorting: true });
  const [filters, setFilters] = useState<AggregateTaskFilters>(
    initialState.initialFilters,
  );

  const { data: selfUser } = useGetSelfUser();
  const [{ data: selfLeaders }, { data: selfGroups }, { data: tasksResponse }] =
    useSuspenseQueries({
      queries: [
        useGetSelfLeadersQueryOptions(),
        useGetSelfGroupsQueryOptions(),
        useFetchTasksForOverviewQueryOptions(
          selfUser,
          filters,
          props.searchParams,
        ),
      ],
    });

  const filterSettings = useTaskTableFilterSettings({
    user: selfUser,
    groups: selfGroups.groups,
    leaders: selfLeaders.users,
    initialFilterValues: initialState.initialFilterValues,
    tableControl: tableControl,
    onFilterApply: setFilters,
  });

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={<ToggleFilterButton {...filterSettings.filterButtonProps} />}
        />
      }
      filterSettings={
        filterSettings.filterSettingsVisible && (
          <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
            <FilterSettings {...filterSettings.filterSettingsProps} />
          </FilterSettingsSheet>
        )
      }
    >
      <TableSheet
        footer={
          <Pagination
            totalCount={tasksResponse.count}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={tasksResponse.tasks}
          columns={tasksColumns}
          rowNavigation={{
            route: (row) =>
              resolveProcedureDetailsRoute({
                businessModule: row.original.businessModule,
                procedureId: row.original.procedureId,
              }),
            focusColumnAccessorKey: "taskType",
          }}
          sorting={tableControl.tableSorting}
        />
      </TableSheet>
    </TablePage>
  );
}
