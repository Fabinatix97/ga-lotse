/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Examination, routes } from "@eshg/dental";
import {
  DataTable,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { ExaminationStatusChip } from "@/lib/businessModules/dental/features/examinations/ExaminationStatusChip";
import { PROPHYLAXIS_TYPES } from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";

const columnHelper = createColumnHelper<Examination>();
const COLUMNS = [
  columnHelper.accessor("dateAndTime", {
    header: "Datum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: false,
    meta: {
      width: 150,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("prophylaxisType", {
    header: "Typ",
    cell: (props) => PROPHYLAXIS_TYPES[props.getValue()],
    enableSorting: false,
    meta: {
      width: 250,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("note", {
    header: "Bemerkung",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (props) => <ExaminationStatusChip status={props.getValue()} />,
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
];

const initialSorting: ColumnSort = {
  id: "dateAndTime",
  desc: true,
};

interface ExaminationsTableProps {
  examinations: Examination[];
  childId: string;
}

export function ExaminationsTable(props: ExaminationsTableProps) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  return (
    <TablePage>
      <TableSheet>
        <DataTable
          data={props.examinations}
          columns={COLUMNS}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          rowNavigation={{
            route: (row) =>
              routes.children
                .byId(props.childId)
                .examinations.byId(row.original.id),
            focusColumnAccessorKey: "dateAndTime",
          }}
          minWidth={600}
        />
      </TableSheet>
    </TablePage>
  );
}
