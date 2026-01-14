/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

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
import { ApiAppointmentBlockSortKey } from "@eshg/prostitute-protection-api";

import { mapAppointmentBlockApi } from "../../api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "../../api/queries/apiQueryKeys";
import { getAppointmentBlockGroupsQuery } from "../../api/queries/appointmentBlockApi";
import { useGetAppointmentStandardDurationOptions } from "../../api/queries/appointmentStandardDuration";
import { routes } from "../../config/routes";
import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function ProstituteProtectionAppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS,
  });

  const { appointmentBlockApi } = useProstituteProtectionApiClients();

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
      useGetAppointmentStandardDurationOptions(),
      useGetUsersByGroupQuery("[System] ProstSchG-Berater"),
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
