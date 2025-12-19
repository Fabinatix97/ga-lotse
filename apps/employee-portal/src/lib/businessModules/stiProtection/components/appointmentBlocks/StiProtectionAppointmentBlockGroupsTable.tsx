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
import { ApiAppointmentBlockSortKey } from "@eshg/sti-protection-api";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useAppointmentBlockApi,
  useAppointmentStandardDurationsApi,
} from "@/lib/businessModules/stiProtection/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/stiProtection/api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import { useGetAppointmentBlockGroupsQuery } from "@/lib/businessModules/stiProtection/api/queries/appointmentBlocks";
import {
  getAllConsultantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/stiProtection/api/queries/appointmentStaff";
import {
  useGetHivAppointmentStandardDurationsQuery,
  useGetSexWorkAppointmentStandardDurationsQuery,
} from "@/lib/businessModules/stiProtection/api/queries/appointmentStandardDuration";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function StiProtectionAppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS,
  });

  const appointmentStandardDurationApi = useAppointmentStandardDurationsApi();
  const appointmentBlockApi = useAppointmentBlockApi();
  const userApi = useUserApi();

  const [
    appointmentBlockGroups,
    { data: standardDurationsHiv },
    { data: standardDurationsSexWork },
    { data: physicians },
    { data: consultants },
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
      useGetHivAppointmentStandardDurationsQuery(
        appointmentStandardDurationApi,
      ),
      useGetSexWorkAppointmentStandardDurationsQuery(
        appointmentStandardDurationApi,
      ),
      getAllPhysiciansQuery(userApi),
      getAllConsultantsQuery(userApi),
    ],
  });

  const columnHelper = createColumnHelper<AppointmentBlockRow>();
  const columns = useAppointmentBlockGroupsColumns({
    appointmentBlockApi: mapAppointmentBlockApi(appointmentBlockApi),
    appointmentBlockApiQueryKey,
    physicians,
    consultants,
    standardDurations: {
      standardDurations: {
        ...standardDurationsHiv,
        ...standardDurationsSexWork,
      },
      extraDuration: 0,
    },
    columnHelper,
    showWeekDays: true,
  });

  return (
    <AppointmentBlockGroupsTable
      controls={props.controls}
      isLoading={appointmentBlockGroups.isFetching}
      appointmentBlockGroups={appointmentBlockGroups.data}
      columns={columns}
      tableControl={tableControl}
      newAppointmentBlockRoute={routes.appointmentBlockGroups.new}
    />
  );
}
