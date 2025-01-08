/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTaskStatus } from "@eshg/employee-portal-api/base";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import {
  AggregateTaskFilters,
  useFetchTasksForOverviewQueryOptions,
} from "@/lib/baseModule/api/queries/tasks";
import {
  useGetSelfGroupsQueryOptions,
  useGetSelfLeadersQueryOptions,
  useGetSelfUser,
} from "@/lib/baseModule/api/queries/users";
import {
  FILTER_KEYS,
  useTaskTableFilterSettings,
} from "@/lib/baseModule/components/task/useTaskTableFilterSettings";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SearchParams } from "@/lib/shared/helpers/searchParams";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

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

export function TasksTable(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
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
          left={<FilterButton {...filterSettings.filterButtonProps} />}
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
