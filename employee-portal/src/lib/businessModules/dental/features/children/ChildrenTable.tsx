/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import { useGetChildren } from "@/lib/businessModules/dental/api/queries/childApi";
import { Child } from "@/lib/businessModules/dental/models/Child";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import {
  getSortDirection,
  getSortKey,
} from "@/lib/shared/components/table/sorting";
import { formatSchoolYear } from "@/lib/shared/helpers/formatters";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

const initialSorting: ColumnSort = {
  id: "id",
  desc: true,
};

interface ChildrenTableProps {
  buttons?: ReactNode[];
}

export function ChildrenTable(props: ChildrenTableProps) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const children = useGetChildren({
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
        loading={children.isFetching}
        footer={
          <Pagination
            totalCount={children.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={children.data.elements}
          columns={COLUMNS}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          minWidth={1200}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<Child>();
const COLUMNS = [
  columnHelper.accessor("lastName", {
    header: "Name",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("firstName", {
    header: "Vorname",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("dateOfBirth", {
    header: "Geburtsdatum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: false,
    meta: {
      width: 90,
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
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 50,
    },
  }),
  columnHelper.accessor("year", {
    header: "Jahr",
    cell: (props) => formatSchoolYear(props.getValue()),
    enableSorting: false,
    meta: {
      width: 50,
    },
  }),
];
