/**
 * Copyright 2025 cronn GmbH
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
import { ApiAppointmentBlockSortKey } from "@eshg/official-medical-service-api";

import { appointmentBlockApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import { useAppointmentBlockApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/officialMedicalService/api/mapAppointmentBlockApi";
import { useGetAppointmentBlockGroupsQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentBlocksApi";
import { useGetAppointmentStandardDurationQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentStandardDurationsApi";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function OMSAppointmentBlockGroupsTablePage(
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
        useGetAppointmentBlockGroupsQuery({
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
    standardDurations,
    columnHelper,
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
