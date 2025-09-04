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

import { useDeleteAppointmentBlock } from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentBlocksApi";
import { useGetAppointmentBlockGroupsQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentBlocksApi";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/constants";
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

  const deleteAppointmentBlock = useDeleteAppointmentBlock();
  async function handleDeleteAppointmentBlock(appointmentBlockId: string) {
    await deleteAppointmentBlock.mutateAsync({ appointmentBlockId });
  }

  const [appointmentBlockGroups] = useSuspenseQueries({
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
      appointmentBlockGroups={appointmentBlockGroups.data}
      isLoading={appointmentBlockGroups.isFetching}
      columns={COLUMNS}
      newAppointmentBlockRoute={routes.appointmentBlockGroups.new}
    />
  );
}
