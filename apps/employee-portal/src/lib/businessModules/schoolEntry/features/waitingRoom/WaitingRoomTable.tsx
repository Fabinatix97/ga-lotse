/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { isDefined, isNullish } from "remeda";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  getSortDirection,
  getSortKey,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal";
import { ApiWaitingRoomSortKey } from "@eshg/school-entry-api";

import { WaitingRoomProcedure } from "@/lib/businessModules/schoolEntry/api/models/WaitingRoom";
import { useGetWaitingRoomProcedures } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { WAITING_STATUS_VALUES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { formatDateTimeRangeToNowInMinutes } from "@/lib/shared/helpers/dateTime";

const initialSorting: ColumnSort = {
  id: "modifiedAt",
  desc: true,
};

export function WaitingRoomTable() {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting,
  });

  const procedures = useGetWaitingRoomProcedures({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey(tableControl.tableSorting, SORT_KEY_MAPPING),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  return (
    <TablePage fullHeight>
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
            focusColumnAccessorKey: "child.lastName",
          }}
          minWidth={1200}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<WaitingRoomProcedure>();
const COLUMNS = [
  columnHelper.accessor("child.firstName", {
    header: "Vorname",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: 180,
    },
  }),
  columnHelper.accessor("child.lastName", {
    header: "Nachname",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: 180,
    },
  }),
  columnHelper.accessor("child.dateOfBirth", {
    header: "Geburtsdatum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: 155,
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
    cell: (props) =>
      isDefined(props.getValue())
        ? WAITING_STATUS_VALUES[props.getValue()!]
        : undefined,
    enableSorting: true,
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
  child_firstName: ApiWaitingRoomSortKey.Firstname,
  child_lastName: ApiWaitingRoomSortKey.Lastname,
  child_dateOfBirth: ApiWaitingRoomSortKey.DateOfBirth,
  waitingRoom_info: ApiWaitingRoomSortKey.Info,
  waitingRoom_status: ApiWaitingRoomSortKey.Status,
  modifiedAt: ApiWaitingRoomSortKey.ModifiedAt,
};
