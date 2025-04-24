/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  getSortDirection,
  getSortKey,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { ApiAppointmentBlockSortKey } from "@eshg/sti-protection-api";
import { ColumnSort } from "@tanstack/react-table";
import { ReactNode } from "react";

import { useDeleteAppointmentBlock } from "@/lib/businessModules/stiProtection/api/mutations/appointmentBlocks";
import { useGetAppointmentBlockGroups } from "@/lib/businessModules/stiProtection/api/queries/appointmentBlocks";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { NoAppointmentBlocksAvailable } from "@/lib/shared/components/appointmentBlocks/NoAppointmentBlocksAvailable";

import {
  getSubRows,
  toAggregatedAppointmentBlockRow,
  useAppointmentBlockGroupsColumns,
} from "./AppointmentBlockGroupsTable.columns";

const initialSorting: ColumnSort = {
  id: "start",
  desc: false,
};

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function AppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const { paginationProps, tableSorting } = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });
  const appointmentBlockGroups = useGetAppointmentBlockGroups({
    pageNumber: paginationProps.pageNumber,
    pageSize: paginationProps.pageSize,
    sortKey: getSortKey<ApiAppointmentBlockSortKey>(tableSorting),
    sortDirection: getSortDirection(tableSorting),
  });
  const appointmentBlockGroupsColumns = useAppointmentBlockGroupsColumns({
    onDeleteAppointmentBlock: ({ appointmentBlockId }) => {
      void handleDeleteAppointmentBlock(appointmentBlockId);
    },
  });

  const deleteAppointmentBlock = useDeleteAppointmentBlock();

  async function handleDeleteAppointmentBlock(appointmentBlockId: string) {
    await deleteAppointmentBlock.mutateAsync({ appointmentBlockId });
  }

  const rows = appointmentBlockGroups.data.elements.map(
    toAggregatedAppointmentBlockRow,
  );
  return (
    <TablePage
      fullHeight
      controls={props.controls}
      data-testid="appointmentBlockGroupsTable"
    >
      <TableSheet
        footer={
          <Pagination
            totalCount={appointmentBlockGroups.data.totalNumberOfElements}
            {...paginationProps}
          />
        }
      >
        <DataTable
          data={rows}
          columns={appointmentBlockGroupsColumns}
          getSubRows={getSubRows}
          sorting={tableSorting}
          noDataComponent={() => (
            <NoAppointmentBlocksAvailable
              href={routes.appointmentBlockGroups.new}
            />
          )}
        />
      </TableSheet>
    </TablePage>
  );
}
