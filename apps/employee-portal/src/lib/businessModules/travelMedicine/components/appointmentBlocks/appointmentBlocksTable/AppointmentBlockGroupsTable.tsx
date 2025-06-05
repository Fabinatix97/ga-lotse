/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
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
import { ApiAppointmentBlockSortKey } from "@eshg/travel-medicine-api";

import { useDeleteAppointmentBlock } from "@/lib/businessModules/travelMedicine/api/mutations/appointmentBlocks";
import { useGetAppointmentBlockGroupsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
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

  const [{ data: appointmentBlockGroups }] = useSuspenseQueries({
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
  const COLUMNS = useAppointmentBlockGroupsColumns({
    onDeleteAppointmentBlock: ({ appointmentBlockId }) => {
      void handleDeleteAppointmentBlock(appointmentBlockId);
    },
  });

  const deleteAppointmentBlock = useDeleteAppointmentBlock();

  async function handleDeleteAppointmentBlock(appointmentBlockId: string) {
    await deleteAppointmentBlock.mutateAsync({ appointmentBlockId });
  }

  const rows = appointmentBlockGroups.elements.map(
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
            totalCount={appointmentBlockGroups.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={rows}
          columns={COLUMNS}
          noDataComponent={() => (
            <NoAppointmentBlocksAvailable
              href={routes.appointmentBlockGroups.new}
            />
          )}
          getSubRows={getSubRows}
          sorting={tableControl.tableSorting}
        />
      </TableSheet>
    </TablePage>
  );
}
