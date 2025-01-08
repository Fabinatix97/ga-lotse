/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Sheet, Stack, Table } from "@mui/joy";
import {
  ColumnDef,
  FilterFnOption,
  TableOptions,
  Table as TanstackTable,
  VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useEffect, useState } from "react";

import { Sidebar } from "@/lib/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/components/sidebar/SidebarContent";
import { EmptyTableHint } from "@/lib/components/table/EmptyTableHint";
import { useColumnFilters } from "@/lib/components/table/Filter";
import { addEditColumns } from "@/lib/components/table/addEditColumns";
import { TableHead } from "@/lib/components/table/head/TableHead";
import { addFeatureColumns } from "@/lib/helpers/addFeatureColumns";
import {
  EditableEntity,
  OverridableEntity,
  UniqueEntity,
} from "@/lib/helpers/entities";
import { useGlobalFilter } from "@/lib/hooks/useGlobalFilter";

import { OverridableTableRow } from "./TableRow";

export interface EditableTableProps<
  TData extends UniqueEntity & OverridableEntity<TData> & EditableEntity,
> {
  data: TableOptions<TData>["data"];
  columns: TableOptions<TData>["columns"];
  initialColumnVisibility?: VisibilityState;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  showColumnHeaders?: boolean;
  globalFilterFn?: FilterFnOption<TData>;
  api: TableApi<TData>;
}

export interface TableApi<TData> {
  create: (orgUnitId?: string) => void;
  update: (
    entity: Partial<
      Omit<
        TData,
        | "actors"
        | "_staged"
        | "_matchingClientRules"
        | "_matchingServerRules"
        | "_matchingClientActors"
        | "_matchingServerActors"
        | "_type"
      >
    >,
  ) => void;
  deleteAudited: (id: string) => void;
  deleteStaged: (id: string) => void;
  activate: (id: string) => void;
  deactivate: (id: string) => void;
}

export function EditableTable<
  TData extends UniqueEntity & OverridableEntity<TData> & EditableEntity,
>(props: Readonly<EditableTableProps<TData>>) {
  const { columnFilters, onColumnFiltersChange } = useColumnFilters(
    props.columns,
  );
  const { globalFilter, onGlobalFilterChange, globalFilterInputElement } =
    useGlobalFilter();

  const enableColumnHeaders = props.showColumnHeaders ?? true;
  const enableGlobalFilter = !props.columns.every(
    (c) => c.enableGlobalFilter === false,
  );
  const enableColumnFilter = props.columns.some((c) => c.enableColumnFilter);

  const columns: ColumnDef<TData>[] = addEditColumns(
    addFeatureColumns(props.columns, { toggleExpand: true }),
  );

  const tableConfig: TableOptions<TData> = {
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    sortDescFirst: false,
    initialState: {
      columnVisibility: props.initialColumnVisibility,
    },
    getSubRows: props.getSubRows,
    getFilteredRowModel: getFilteredRowModel(),
    enableFilters: enableColumnFilter || enableGlobalFilter,
    globalFilterFn: props.globalFilterFn ?? "includesString",
    enableGlobalFilter,
    onColumnFiltersChange,
    onGlobalFilterChange,
    state: {
      columnFilters,
      globalFilter,
    },
    meta: {
      api: props.api,
    },
  };

  const reactTable: TanstackTable<TData> = useReactTable(tableConfig);

  const { rows } = reactTable.getRowModel();

  // expand all by default
  useEffect(() => {
    reactTable.toggleAllRowsExpanded(true);
  }, [reactTable]);

  const [openDetails, setOpenDetails] = useState(false);
  const [sidebarIndex, setSidebarIndex] = useState<number>();

  function viewDetails(index: number) {
    setSidebarIndex(index);
    setOpenDetails(true);
  }

  return (
    <Stack flex="1" flexDirection="column" spacing={2}>
      {enableGlobalFilter && globalFilterInputElement}
      <Sheet
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 0",
          minHeight: "0px",
          padding: (theme) => theme.spacing(2),
          borderRadius: (theme) => theme.radius.lg,
          backgroundColor: (theme) => theme.palette.background.level2,
          border: "1px solid",
          borderColor: "#CDD7E1",
        }}
      >
        <Box
          sx={{
            overflow: "auto",
          }}
        >
          <Table
            hoverRow
            stickyHeader
            noWrap
            sx={{
              paddingRight: (theme) => theme.spacing(1.5),
              tableLayout: "auto",
            }}
            stripe="even"
          >
            <TableHead
              enableColumnHeaders={enableColumnHeaders}
              enableColumnFilter={enableColumnFilter}
              reactTable={reactTable}
            />
            <tbody>
              {
                <EmptyTableHint
                  empty={!props.data.length}
                  allFiltered={!rows.length}
                  columns={reactTable.getAllColumns().length}
                />
              }
              {rows.map((row, i) => {
                return (
                  <Fragment key={row.id}>
                    <OverridableTableRow
                      table={reactTable}
                      row={row}
                      onClick={() => viewDetails(i)}
                    />
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
          {rows[sidebarIndex ?? 0] && (
            <Sidebar open={openDetails} onClose={setOpenDetails}>
              <SidebarContent row={rows[sidebarIndex ?? 0]} />
            </Sidebar>
          )}
        </Box>
      </Sheet>
    </Stack>
  );
}
