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

import { useDeleteAppointmentBlock } from "@/lib/businessModules/travelMedicine/api/mutations/appointmentBlocks";
import { useGetAppointmentBlockGroupsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/translations";
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

  const [{ data: appointmentBlockGroups, isFetching }] = useSuspenseQueries({
    queries: [
      useGetAppointmentBlockGroupsQuery({
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
