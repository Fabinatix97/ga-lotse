/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { isNullish } from "remeda";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  formatDateTimeRangeToNowInMinutes,
  getSortDirection,
  getSortKey,
  usePersistentTableControl,
} from "@eshg/lib-employee-portal";
import { formatOptionalKey } from "@eshg/lib-portal";
import {
  ApiWaitingRoomProcedure,
  ApiWaitingRoomSortKey,
} from "@eshg/prostitute-protection-api";

import { useGetWaitingRoomProcedures } from "../../api/queries/waitingRoom";
import { routes } from "../../config/routes";
import { WAITING_STATUS_VALUES } from "../../shared/constants";

const initialSorting: ColumnSort = {
  id: "modifiedAt",
  desc: true,
};

export function WaitingRoomTable() {
  const tableControl = usePersistentTableControl(
    "PPR_WAITING_ROOM_TABLE_CONTROL",
    {
      serverSideSorting: true,
      sortFieldName: "sortKey",
      sortDirectionName: "sortDirection",
      initialSorting,
    },
  );

  const procedures = useGetWaitingRoomProcedures({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey(tableControl.tableSorting, SORT_KEY_MAPPING),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  return (
    <TablePage fullHeight data-testid="waitingRoomTable">
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
          columns={COLUMNS}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          rowNavigation={{
            route: (row) => routes.procedures.byId(row.original.id).details,
            focusColumnAccessorKey: "alias",
          }}
          minWidth={1200}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<ApiWaitingRoomProcedure>();
const COLUMNS = [
  columnHelper.accessor("alias", {
    header: "Alias",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: 180,
    },
  }),
  columnHelper.accessor("waitingRoom.description", {
    header: "Info",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: 245,
    },
  }),
  columnHelper.accessor("waitingRoom.status", {
    header: "Status",
    cell: (props) => formatOptionalKey(props.getValue(), WAITING_STATUS_VALUES),
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: 220,
    },
  }),
  columnHelper.accessor("modifiedAt", {
    header: "Seit",
    cell: (props) =>
      isNullish(props.getValue())
        ? ""
        : formatDateTimeRangeToNowInMinutes(props.getValue()),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];

const SORT_KEY_MAPPING: Record<string, ApiWaitingRoomSortKey> = {
  alias: ApiWaitingRoomSortKey.Alias,
  waitingRoom_description: ApiWaitingRoomSortKey.Info,
  modifiedAt: ApiWaitingRoomSortKey.ModifiedAt,
};
