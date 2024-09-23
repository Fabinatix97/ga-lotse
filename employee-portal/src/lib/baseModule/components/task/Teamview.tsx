/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiBusinessModule,
  ApiGetTaskByUserResponse,
  ApiTask,
  ApiUser,
} from "@eshg/employee-portal-api/businessProcedures";
import { UseSuspenseQueryResult } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import { useState } from "react";

import { useGetUsersByGroupQuery } from "@/lib/baseModule/api/queries/users";
import { teamviewColumns } from "@/lib/baseModule/components/task/teamviewColumns";
import { useTeamviewFilterSettings } from "@/lib/baseModule/components/task/useTeamviewFilterSettings";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { TeamviewFilters } from "@/lib/shared/api/queries/tasks";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export interface TaskCounts {
  nonOverdueTaskCount: number;
  overdueTaskCount: number;
}

export interface TaskRow {
  isOverdue?: boolean;
  userId?: string;
  name?: string;
  tasks: string | TaskCounts;
  dueAtInDays?: number;
  assignedBy?: string;
  createdAt?: Date;
  procedureId?: string;
  subRows?: TaskRow[];
}

function memberFilter({ assigneeId }: TeamviewFilters) {
  return (user: ApiUser) => (assigneeId ? assigneeId.has(user.userId) : true);
}

interface TeamviewPageProps {
  groupName: string;
  businessModule: ApiBusinessModule;
  useFetchTasksForTeamView: (
    teamviewFilters: TeamviewFilters,
  ) => UseSuspenseQueryResult<ApiGetTaskByUserResponse, Error>;
}

export function Teamview(props: Readonly<TeamviewPageProps>) {
  const groupMembers = useGetUsersByGroupQuery(props.groupName).data.users;

  const [filters, setFilters] = useState<TeamviewFilters>({});

  const { data: taskResponse } = props.useFetchTasksForTeamView(filters);

  function toTaskRows(groupMember: ApiUser): TaskRow {
    const tasks = taskResponse.tasksByUser[groupMember.userId] ?? [];
    const overdueTaskCount = tasks.filter((task) => task.isOverdue).length;
    const nonOverdueTaskCount = tasks.length - overdueTaskCount;

    const taskCounts: TaskCounts = {
      nonOverdueTaskCount: nonOverdueTaskCount,
      overdueTaskCount: overdueTaskCount,
    };

    return {
      userId: groupMember.userId,
      name: fullName(groupMember),
      tasks: taskCounts,
      subRows: toTaskSubRows(tasks),
    };
  }

  function toTaskSubRows(tasks: ApiTask[]): TaskRow[] {
    return tasks.map(toTaskSubRow);
  }

  function toTaskSubRow({
    summary,
    dueAt,
    isOverdue,
    assignedById,
    createdAt,
    procedureId,
  }: ApiTask): TaskRow {
    const resolvedUser = assignedById
      ? taskResponse.resolvedUsers[assignedById]
      : undefined;

    return {
      isOverdue: isOverdue,
      tasks: summary,
      dueAtInDays: dueAt ? differenceInDays(dueAt, new Date()) : undefined,
      assignedBy: fullName(resolvedUser),
      createdAt: createdAt,
      procedureId: procedureId,
    };
  }

  const rows: TaskRow[] = groupMembers
    .filter(memberFilter(filters))
    .map(toTaskRows);

  const filterSettings = useTeamviewFilterSettings({
    groupMembers: groupMembers,
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
      <TableSheet>
        <DataTable
          data={rows}
          rowNavRoute={(row) =>
            row.depth === 0
              ? undefined
              : resolveProcedureDetailsRoute({
                  businessModule: props.businessModule,
                  procedureId: row.original.procedureId!,
                })
          }
          columns={teamviewColumns}
          getSubRows={(row) => row.subRows}
        />
      </TableSheet>
    </TablePage>
  );
}
