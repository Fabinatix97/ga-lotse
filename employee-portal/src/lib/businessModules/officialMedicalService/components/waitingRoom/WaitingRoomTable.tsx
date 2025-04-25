/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ColumnSort } from "@tanstack/react-table";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  TableSortingProps,
  getSortDirection,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { ApiWaitingRoomSortKey } from "@eshg/official-medical-service-api";

import { useGetWaitingRoomProcedures } from "@/lib/businessModules/officialMedicalService/api/queries/waitingRoomApi";
import { waitingRoomColumns } from "@/lib/businessModules/officialMedicalService/components/waitingRoom/waitingRoomColumns";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

const initialSorting: ColumnSort = {
  id: "modifiedAt",
  desc: true,
};

export function WaitingRoomTable() {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const procedures = useGetWaitingRoomProcedures({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey(tableControl.tableSorting),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  return (
    <TablePage fullHeight data-testid="waiting-room-table">
      <TableSheet
        loading={procedures.isFetching}
        footer={
          <Pagination
            totalCount={procedures.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={procedures.data.elements}
          columns={waitingRoomColumns()}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          rowNavigation={{
            route: (row) => routes.procedures.byId(row.original.id).details,
            focusColumnAccessorKey: "lastName",
          }}
          minWidth={1200}
        ></DataTable>
      </TableSheet>
    </TablePage>
  );
}

const SORT_KEY_MAPPING: Record<string, ApiWaitingRoomSortKey> = {
  firstName: ApiWaitingRoomSortKey.Firstname,
  lastName: ApiWaitingRoomSortKey.Lastname,
  dateOfBirth: ApiWaitingRoomSortKey.DateOfBirth,
  facilityName: ApiWaitingRoomSortKey.Facility,
  physicianName: ApiWaitingRoomSortKey.Physician,
  waitingRoom_info: ApiWaitingRoomSortKey.Info,
  waitingRoom_status: ApiWaitingRoomSortKey.Status,
  modifiedAt: ApiWaitingRoomSortKey.ModifiedAt,
};

function getSortKey(
  sortingProps: TableSortingProps,
): ApiWaitingRoomSortKey | undefined {
  const sorting = sortingProps.manualSorting
    ? sortingProps.sortingState
    : sortingProps.initialSorting;
  if (sorting?.[0] === undefined) return undefined;

  const columnId = sorting[0].id;
  return SORT_KEY_MAPPING[columnId];
}
