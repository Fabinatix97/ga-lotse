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
import {
  ApiAppointmentBlockSortKey,
  ApiLocationSelectionMode,
} from "@eshg/school-entry-api";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useAppointmentBlockApi,
  useAppointmentStandardDurationsApi,
  useConfigApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { getAppointmentBlockGroupsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import {
  getAllMedicalAssistantsQuery,
  getAllPhysiciansQuery,
  getAllSopassQualifiedMFAsQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/appointmentStaff";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentStandardDuration";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function SchoolEntryAppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS,
  });

  const configApi = useConfigApi();
  const appointmentBlockApi = useAppointmentBlockApi();
  const standardDurationApi = useAppointmentStandardDurationsApi();
  const userApi = useUserApi();

  const [
    { data: locationSelectionMode },
    getAppointmentBlockGroups,
    { data: standardDurations },
    { data: physicians },
    { data: mfas },
    { data: sopasss },
  ] = useSuspenseQueries({
    queries: [
      getLocationSelectionModeQuery(configApi),
      getAppointmentBlockGroupsQuery(appointmentBlockApi, {
        pageNumber: tableControl.paginationProps.pageNumber,
        pageSize: tableControl.paginationProps.pageSize,
        sortKey: getSortKey<ApiAppointmentBlockSortKey>(
          tableControl.tableSorting,
        ),
        sortDirection: getSortDirection(tableControl.tableSorting),
      }),
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
      getAllPhysiciansQuery(userApi),
      getAllMedicalAssistantsQuery(userApi),
      getAllSopassQualifiedMFAsQuery(userApi),
    ],
  });

  const columnHelper = createColumnHelper<AppointmentBlockRow>();
  const columns = useAppointmentBlockGroupsColumns({
    appointmentBlockApi: mapAppointmentBlockApi(appointmentBlockApi),
    appointmentBlockApiQueryKey,
    physicians,
    mfas,
    sopasss,
    standardDurations,
    columnHelper,
    additionalColumn:
      locationSelectionMode !== ApiLocationSelectionMode.None
        ? columnHelper.accessor("location.name", {
            header: "Ort",
            cell: (props) => props.getValue(),
            enableSorting: false,
            meta: { width: 220 },
          })
        : undefined,
  });

  return (
    <AppointmentBlockGroupsTable
      controls={props.controls}
      isLoading={getAppointmentBlockGroups.isFetching}
      appointmentBlockGroups={getAppointmentBlockGroups.data}
      columns={columns}
      tableControl={tableControl}
      newAppointmentBlockRoute={routes.appointments.appointmentBlockGroups.new}
    />
  );
}
