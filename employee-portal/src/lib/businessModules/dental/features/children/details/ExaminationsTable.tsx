/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { Examination } from "@/lib/businessModules/dental/api/models/Examination";
import { PROPHYLAXIS_TYPES } from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";
import { routes } from "@/lib/businessModules/dental/shared/routes";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

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
