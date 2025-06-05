/**
 * Copyright 2025 cronn GmbH
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
import { ApiAppointmentBlockSortKey } from "@eshg/official-medical-service-api";

import { useDeleteAppointmentBlock } from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentBlocksApi";
import { useGetAppointmentBlockGroupsQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentBlocksApi";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { NoAppointmentBlocksAvailable } from "@/lib/shared/components/appointmentBlocks/NoAppointmentBlocksAvailable";

import {
  getSubRows,
  toAggregatedAppointmentBlockRow,
  useAppointmentBlockGroupsColumns,
} from "./AppointmentBlockGroupTable.columns";

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
  const COLUMNS = useAppointmentBlockGroupsColumns({
    onDeleteAppointmentBlock: ({ appointmentBlockId }) => {
      void handleDeleteAppointmentBlock(appointmentBlockId);
    },
  });

  const deleteAppointmentBlock = useDeleteAppointmentBlock();

  async function handleDeleteAppointmentBlock(appointmentBlockId: string) {
    await deleteAppointmentBlock.mutateAsync({ appointmentBlockId });
  }

  const [getAppointmentBlockGroups] = useSuspenseQueries({
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

  const rows = getAppointmentBlockGroups.data.elements.map(
    toAggregatedAppointmentBlockRow,
  );

  return (
    <TablePage
      fullHeight
      controls={props.controls}
      data-testid="appointmentBlockGroupsTable"
    >
      <TableSheet
        loading={getAppointmentBlockGroups.isFetching}
        footer={
          <Pagination
            totalCount={getAppointmentBlockGroups.data.totalNumberOfElements}
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
