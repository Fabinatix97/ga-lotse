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
  TableSortingProps,
  getSortDirection,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { GENDER_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { ifDefined } from "@eshg/lib-portal/helpers/ifDefined";
import {
  ApiWaitingRoomProcedure,
  ApiWaitingRoomSortKey,
} from "@eshg/sti-protection-api";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { differenceInMinutes } from "date-fns";

import { useGetWaitingRoomProcedures } from "@/lib/businessModules/stiProtection/api/queries/waitingRoomApi";
import { DisplayAccessCode } from "@/lib/businessModules/stiProtection/features/procedures/DisplayAccessCode";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

import { StatusChip } from "./StatusChip";

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
    <TablePage fullHeight aria-label="Einträge in Wartezimmer">
      <TableSheet
        loading={procedures.isPending}
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
            route: (row) =>
              routes.procedures.byId(row.original.procedureId).details,
            focusColumnAccessorKey: "accessCode",
          }}
          minWidth={1200}
        />
      </TableSheet>
    </TablePage>
  );
}

function now() {
  return new Date();
}

const columnHelper = createColumnHelper<ApiWaitingRoomProcedure>();
const COLUMNS = [
  columnHelper.accessor("accessCode", {
    header: "Anmeldecode",
    cell: (props) => <DisplayAccessCode code={props.getValue()} />,
    enableSorting: false,
    meta: {
      width: 200,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("yearOfBirth", {
    header: "Geburtsjahr",
    cell: (props) => props.getValue(),
    meta: {
      width: 150,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("gender", {
    header: "Geschlecht",
    cell: (props) => GENDER_VALUES[props.getValue()],
    meta: {
      width: 150,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("waitingRoom.info", {
    header: "Info",
    cell: (props) => props.getValue(),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("waitingRoom.status", {
    header: "Status",
    cell: (props) => <StatusChip status={props.getValue()} />,
    meta: {
      width: 275,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("modifiedAt", {
    header: "Seit",
    cell: (props) =>
      ifDefined(
        props.getValue(),
        (d) => `${differenceInMinutes(now(), new Date(d))} Min`,
      ),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];

const SORT_KEY_MAPPING: Record<string, ApiWaitingRoomSortKey> = {
  yearOfBirth: ApiWaitingRoomSortKey.YearOfBirth,
  gender: ApiWaitingRoomSortKey.Gender,
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
