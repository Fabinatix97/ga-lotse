/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import { useGetProphylaxisSessions } from "@/lib/businessModules/dental/api/queries/prophylaxisSessionApi";
import { ProphylaxisSession } from "@/lib/businessModules/dental/models/ProphylaxisSession";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import {
  getSortDirection,
  getSortKey,
} from "@/lib/shared/components/table/sorting";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

const initialSorting: ColumnSort = {
  id: "id",
  desc: true,
};

interface ProphylaxisSessionsTableProps {
  buttons?: ReactNode[];
}

export function ProphylaxisSessionsTable(props: ProphylaxisSessionsTableProps) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const sessions = useGetProphylaxisSessions({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey(tableControl.tableSorting),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  return (
    <TablePage
      fullHeight
      controls={<ButtonBar right={props.buttons} alignItems="flex-end" />}
    >
      <TableSheet
        loading={sessions.isFetching}
        footer={
          <Pagination
            totalCount={sessions.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={sessions.data.elements}
          columns={COLUMNS}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          minWidth={400}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<ProphylaxisSession>();
const COLUMNS = [
  columnHelper.accessor("dateAndTime", {
    header: "Zeitpunkt",
    cell: (props) => formatDateTime(props.getValue()),
    enableSorting: false,
    meta: {
      width: 120,
    },
  }),
  columnHelper.accessor("institution.name", {
    header: "Einrichtung",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
    },
  }),
];
