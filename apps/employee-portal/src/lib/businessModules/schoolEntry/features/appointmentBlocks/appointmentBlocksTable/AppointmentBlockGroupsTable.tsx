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
import { ApiAppointmentBlockSortKey } from "@eshg/school-entry-api";

import {
  useAppointmentBlockApi,
  useConfigApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { useDeleteAppointmentBlock } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { getAppointmentBlockGroupsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";

import {
  getSubRows,
  toAggregatedAppointmentBlockRow,
  useAppointmentBlockColumns,
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
  const columns = useAppointmentBlockColumns({
    onDeleteAppointmentBlock: ({ appointmentBlockId }) => {
      void handleDeleteAppointmentBlock(appointmentBlockId);
    },
    locationSelectionMode,
  });

  const deleteAppointmentBlock = useDeleteAppointmentBlock();

  async function handleDeleteAppointmentBlock(appointmentBlockId: string) {
    await deleteAppointmentBlock.mutateAsync({ appointmentBlockId });
  }

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
          columns={columns}
          getSubRows={getSubRows}
          sorting={tableControl.tableSorting}
          minWidth={1000}
        />
      </TableSheet>
    </TablePage>
  );
}
