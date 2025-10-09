/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
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
import { ApiAppointmentBlockSortKey } from "@eshg/travel-medicine-api";

import {
  useAppointmentBlockApi,
  useAppointmentStandardDurationsApi,
} from "@/lib/businessModules/travelMedicine/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/travelMedicine/api/mapAppointmentBlockApi";
import { useGetAppointmentBlockGroupsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import {
  useGetAllMedicalAssistantsQuery,
  useGetAllPhysiciansQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentStandardDurations";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function TravelMedicineAppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS,
  });
  const standardDurationApi = useAppointmentStandardDurationsApi();
  const appointmentBlockApi = useAppointmentBlockApi();

  const [
    { data: appointmentBlockGroups, isFetching },
    { data: standardDurations },
    { data: physicians },
    { data: mfas },
  ] = useSuspenseQueries({
    queries: [
      useGetAppointmentBlockGroupsQuery({
        pageNumber: tableControl.paginationProps.pageNumber,
        pageSize: tableControl.paginationProps.pageSize,
        sortKey: getSortKey<ApiAppointmentBlockSortKey>(
          tableControl.tableSorting,
        ),
        sortDirection: getSortDirection(tableControl.tableSorting),
      }),
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
      useGetAllPhysiciansQuery(),
      useGetAllMedicalAssistantsQuery(),
    ],
  });

  const columnHelper = createColumnHelper<AppointmentBlockRow>();
  const COLUMNS = useAppointmentBlockGroupsColumns({
    appointmentBlockApi: mapAppointmentBlockApi(appointmentBlockApi),
    appointmentBlockApiQueryKey,
    physicians,
    mfas,
    standardDurations,
    columnHelper,
  });

  return (
    <AppointmentBlockGroupsTable
      controls={props.controls}
      tableControl={tableControl}
      appointmentBlockGroups={appointmentBlockGroups}
      isLoading={isFetching}
      columns={COLUMNS}
      newAppointmentBlockRoute={routes.appointmentBlockGroups.new}
    />
  );
}
