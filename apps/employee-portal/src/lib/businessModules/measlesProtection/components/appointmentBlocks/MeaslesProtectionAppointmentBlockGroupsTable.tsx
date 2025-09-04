/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

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

import { useDeleteAppointmentBlock } from "@/lib/businessModules/measlesProtection/api/mutations/appointmentBlockApi";
import { useGetAppointmentBlockGroups } from "@/lib/businessModules/measlesProtection/api/queries/appointmentBlockApi";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/measlesProtection/shared/constants";
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
  const appointmentBlockGroups = useGetAppointmentBlockGroups({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey<ApiAppointmentBlockSortKey>(tableControl.tableSorting),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  const deleteAppointmentBlock = useDeleteAppointmentBlock();

  async function handleDeleteAppointmentBlock(appointmentBlockId: string) {
    await deleteAppointmentBlock.mutateAsync({ appointmentBlockId });
  }

  const columnHelper = createColumnHelper<AppointmentBlockRow>();
  const COLUMNS = useAppointmentBlockGroupsColumns({
    onDeleteAppointmentBlock: ({ appointmentBlockId }) => {
      void handleDeleteAppointmentBlock(appointmentBlockId);
    },
    appointmentTypes: APPOINTMENT_TYPES,
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
