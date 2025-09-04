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
import {
  ApiAppointmentBlockSortKey,
  ApiLocationSelectionMode,
} from "@eshg/school-entry-api";

import {
  useAppointmentBlockApi,
  useConfigApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { useDeleteAppointmentBlock } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { getAppointmentBlockGroupsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
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
  const [{ data: locationSelectionMode }, getAppointmentBlockGroups] =
    useSuspenseQueries({
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
      ],
    });

  const deleteAppointmentBlock = useDeleteAppointmentBlock();
  const columnHelper = createColumnHelper<AppointmentBlockRow>();
  const columns = useAppointmentBlockGroupsColumns({
    onDeleteAppointmentBlock: ({ appointmentBlockId }) => {
      void deleteAppointmentBlock(appointmentBlockId);
    },
    columnHelper,
    appointmentTypes: APPOINTMENT_TYPES,
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
