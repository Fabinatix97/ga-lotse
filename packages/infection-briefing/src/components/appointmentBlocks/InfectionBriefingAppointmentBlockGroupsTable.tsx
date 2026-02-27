/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import { ApiAppointmentBlockSortKey } from "@eshg/infection-briefing-api";
import {
  AppointmentBlockGroupsTable,
  AppointmentBlockRow,
  INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS,
  getSortDirection,
  getSortKey,
  useAppointmentBlockGroupsColumns,
  useGetUsersByGroupQuery,
  useTableControl,
} from "@eshg/lib-employee-portal";

import { mapAppointmentBlockApi } from "../../api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "../../api/queries/apiQueryKeys";
import { getAppointmentBlockGroupsQuery } from "../../api/queries/appointmentBlockApi";
import { useGetAppointmentStandardDurationOptions } from "../../api/queries/appointmentStandardDuration";
import { routes } from "../../config/routes";
import { useInfectionBriefingApiClients } from "../../contexts/InfectionBriefingApi";

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function InfectionBriefingAppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS,
  });

  const { appointmentBlockApi, appointmentStandardDurationApi } =
    useInfectionBriefingApiClients();

  const [
    appointmentBlockGroups,
    { data: standardDurations },
    { data: allConsultants },
  ] = useSuspenseQueries({
    queries: [
      getAppointmentBlockGroupsQuery(appointmentBlockApi, {
        pageNumber: tableControl.paginationProps.pageNumber,
        pageSize: tableControl.paginationProps.pageSize,
        sortKey: getSortKey<ApiAppointmentBlockSortKey>(
          tableControl.tableSorting,
        ),
        sortDirection: getSortDirection(tableControl.tableSorting),
      }),
      useGetAppointmentStandardDurationOptions(appointmentStandardDurationApi),
      useGetUsersByGroupQuery("[System] InfB-Berater"),
    ],
  });

  const columnHelper = createColumnHelper<AppointmentBlockRow>();
  const appointmentBlockGroupsColumns = useAppointmentBlockGroupsColumns({
    appointmentBlockApi: mapAppointmentBlockApi(appointmentBlockApi),
    appointmentBlockApiQueryKey,
    standardDurations,
    columnHelper,
    showWeekDays: true,
    consultants: allConsultants,
  });

  return (
    <AppointmentBlockGroupsTable
      controls={props.controls}
      tableControl={tableControl}
      appointmentBlockGroups={appointmentBlockGroups.data}
      isLoading={appointmentBlockGroups.isFetching}
      columns={appointmentBlockGroupsColumns}
      newAppointmentBlockRoute={routes.appointmentBlockGroups.new}
    />
  );
}
