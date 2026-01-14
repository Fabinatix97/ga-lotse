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
  useTableControl,
} from "@eshg/lib-employee-portal";
import { ApiAppointmentBlockSortKey } from "@eshg/measles-protection-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/measlesProtection/api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import { useGetAppointmentBlockGroupsOptions } from "@/lib/businessModules/measlesProtection/api/queries/appointmentBlockApi";
import { useGetAppointmentStandardDurationQuery } from "@/lib/businessModules/measlesProtection/api/queries/appointmentStandardConfiguration";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function MeaslesProtectionAppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS,
  });

  const [appointmentBlockGroups, { data: standardDurations }] =
    useSuspenseQueries({
      queries: [
        useGetAppointmentBlockGroupsOptions({
          pageNumber: tableControl.paginationProps.pageNumber,
          pageSize: tableControl.paginationProps.pageSize,
          sortKey: getSortKey<ApiAppointmentBlockSortKey>(
            tableControl.tableSorting,
          ),
          sortDirection: getSortDirection(tableControl.tableSorting),
        }),
        useGetAppointmentStandardDurationQuery(),
      ],
    });

  const appointmentBlockApi = useAppointmentBlockApi();
  const columnHelper = createColumnHelper<AppointmentBlockRow>();
  const COLUMNS = useAppointmentBlockGroupsColumns({
    appointmentBlockApi: mapAppointmentBlockApi(appointmentBlockApi),
    appointmentBlockApiQueryKey,
    withTeam: false,
    standardDurations,
    columnHelper,
    showWeekDays: true,
  });

  return (
    <AppointmentBlockGroupsTable
      controls={props.controls}
      tableControl={tableControl}
      appointmentBlockGroups={appointmentBlockGroups.data}
      isLoading={appointmentBlockGroups.isFetching}
      columns={COLUMNS}
      newAppointmentBlockRoute={routes.appointmentBlockGroups.new}
    />
  );
}
