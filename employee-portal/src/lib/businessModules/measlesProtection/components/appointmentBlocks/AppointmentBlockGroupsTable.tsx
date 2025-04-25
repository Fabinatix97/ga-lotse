/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ColumnSort } from "@tanstack/react-table";
import { ReactNode } from "react";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  getSortDirection,
  getSortKey,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { ApiAppointmentBlockSortKey } from "@eshg/measles-protection-api";

import { useDeleteAppointmentBlock } from "@/lib/businessModules/measlesProtection/api/mutations/appointmentBlockApi";
import { useGetAppointmentBlockGroups } from "@/lib/businessModules/measlesProtection/api/queries/appointmentBlockApi";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
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
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });
  const appointmentBlockGroups = useGetAppointmentBlockGroups({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey<ApiAppointmentBlockSortKey>(tableControl.tableSorting),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  const COLUMNS = useAppointmentBlockGroupsColumns({
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
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={rows}
          columns={COLUMNS}
          getSubRows={getSubRows}
          sorting={tableControl.tableSorting}
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
