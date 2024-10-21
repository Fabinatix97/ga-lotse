/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Table as JoyTable, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { visuallyHidden } from "@mui/utils";
import {
  Cell,
  Row,
  RowSelectionOptions,
  RowSelectionTableState,
  SortingState,
  TableOptions,
  Table as TanstackTable,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ComponentPropsWithRef, Fragment, ReactNode } from "react";
import { isDefined, isFunction } from "remeda";

import { NoEntries } from "@/lib/baseModule/components/NoEntries";
import { TableNavigationProvider } from "@/lib/shared/components/table/TableNavigationContext";
import { TableRow } from "@/lib/shared/components/table/TableRow";
import { TableSubRow } from "@/lib/shared/components/table/TableSubRow";

import { Header } from "./Header";
import { addFeatureColumns } from "./columns/addFeatureColumns";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    width?: number | string;
    headerLabel?: string;
    cellStyle?: CellStyle;
    canNavigate?: {
      parentRow?: boolean;
      subRow?: boolean;
    };
    textAlign?: ColumnTextAlign;
  }
}

export type CellStyle = "button" | "icon" | "checkbox";
export type ColumnTextAlign = "left" | "right";

export interface ManualSortingProps {
  manualSorting: true;
  sortingState: SortingState;
  onSortingChange?: (state?: SortingState) => void;
}

export interface AutomaticSortingProps {
  manualSorting?: false;
  initialSorting?: SortingState;
}

export interface SubRowColumnProps<TData> {
  renderCell?: (cell: Cell<TData, unknown>) => ReactNode;
  tdProps?: Pick<ComponentPropsWithRef<"td">, "colSpan" | "align" | "valign">;
  skip?: boolean;
}

export type SubRowColumns<TData> = Record<string, SubRowColumnProps<TData>>;

export interface RowSelectionProps<TData>
  extends Pick<
    Required<RowSelectionOptions<TData>>,
    SupportedRowSelectionOptions
  > {
  state: RowSelectionTableState;
  getRowId: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}
type SupportedRowSelectionOptions =
  | "enableRowSelection"
  | "onRowSelectionChange";

export interface DataTableProps<TData> {
  data: TableOptions<TData>["data"];
  columns: TableOptions<TData>["columns"];
  initialColumnVisibility?: VisibilityState;
  sorting?: ManualSortingProps | AutomaticSortingProps;
  /** Should be false - this parameter can be removed when all tables are migrated to have an explicit initial sorting */
  enableSortingRemoval?: boolean;
  /** additional optional columns which are displayed below each row */
  subRowColumns?: SubRowColumns<TData>;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  showColumnHeaders?: boolean;
  /**
   * @default true
   */
  striped?: boolean;
  noDataComponent?: () => ReactNode;
  rowNavRoute?: (row: Row<TData>) => string | undefined;
  focusColumnHeader?: string;
  /** By default, the (text) content is truncated. Set to true, to break the content into multiple lines. */
  wrapContent?: boolean;
  /** Set to true to break the header text into multiple lines. */
  wrapHeader?: boolean;
  /** minWidth of the table element. This prop should be combined with the width meta property on individual columns. */
  minWidth?: number | string;
  rowSelectionProps?: RowSelectionProps<TData>;
}

export function DataTable<TData>(props: Readonly<DataTableProps<TData>>) {
  const { wrapContent = false, wrapHeader = false } = props;
  const enableColumnHeaders = props.showColumnHeaders ?? true;
  const sorting = props.sorting;
  const hasSubRows = isDefined(props.getSubRows);
  const NoDataComponent = props.noDataComponent ?? NoEntries;
  const striped = props.striped ?? true;
  const tableConfig: TableOptions<TData> = {
    data: props.data,
    columns: addFeatureColumns(props.columns, {
      toggleExpand: hasSubRows,
      toggleSelect: isDefined(props.rowSelectionProps),
    }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: hasSubRows ? getExpandedRowModel() : undefined,
    manualSorting: sorting?.manualSorting,
    sortDescFirst: false,
    initialState: {
      columnVisibility: props.initialColumnVisibility,
      sorting: sorting?.manualSorting
        ? sorting.sortingState
        : sorting?.initialSorting,
    },
    enableSortingRemoval: props.enableSortingRemoval,
    getSubRows: props.getSubRows,
    ...props.rowSelectionProps,
  };

  if (sorting?.manualSorting) {
    tableConfig.onSortingChange = (updater) => {
      const newState = isFunction(updater)
        ? updater(sorting.sortingState ?? [])
        : updater;
      sorting.onSortingChange?.(newState);
    };
    tableConfig.state = {
      ...tableConfig.state,
      sorting: sorting.sortingState,
    };
  }

  const reactTable: TanstackTable<TData> = useReactTable(tableConfig);

  const tableStyle: SxProps = {
    minWidth: props.minWidth,
    // 7px = 8px padding - 1px for border
    // We only have one 1px border per row,
    // so this leaves 1px free (25px content-space): go wild
    "--TableCell-paddingY": "7px",
    "--TableCell-paddingX": (theme) => theme.spacing(1.5),
    ...(wrapHeader && {
      "& thead th": {
        whiteSpace: "normal",
        overflowWrap: "break-word",
        hyphens: "auto",
      },
    }),
    ...(wrapContent && {
      "& tbody td": {
        overflowWrap: "break-word",
        hyphens: "auto",
      },
    }),
    // when using subrows, we need to override the table style a little bit
    ...(isDefined(props.subRowColumns) && {
      // undo stripe
      "& tbody tr:nth-of-type(even)": {
        background: "var(--TableRow-background, var(--joy-palette-surface))",
      },
      // add stripe for every 4th row
      "& tbody tr:nth-of-type(4n+3), & tbody tr:nth-of-type(4n+4)": {
        background:
          "var(--TableRow-stripeBackground, var(--joy-palette-background-level2))",
        color: "var(--joy-palette-text-primary)",
      },
      // remove border between row and subcomponent
      "& tr:nth-of-type(2n+1) > td": {
        borderBottomWidth: "0",
        borderBottomStyle: "hidden",
      },
    }),
  };

  return (
    <Stack sx={{ flex: 1, overflow: "auto", gap: 2 }}>
      <JoyTable
        stickyHeader
        noWrap={!wrapContent}
        stripe={striped ? "even" : undefined}
        sx={tableStyle}
      >
        {enableColumnHeaders && (
          <thead>
            {reactTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnDef = header.column.columnDef;
                  const meta = columnDef.meta;
                  return (
                    <Header
                      key={header.id}
                      meta={meta}
                      canSort={header.column.getCanSort()}
                      isSorted={header.column.getIsSorted()}
                      onSort={header.column.getToggleSortingHandler()}
                    >
                      {columnDef.header === "" && meta?.cellStyle === "icon" ? (
                        <Typography sx={visuallyHidden}>
                          {meta?.headerLabel}
                        </Typography>
                      ) : (
                        flexRender(columnDef.header, header.getContext())
                      )}
                    </Header>
                  );
                })}
              </tr>
            ))}
          </thead>
        )}

        <TableNavigationProvider
          enabled={isDefined(props.rowNavRoute)}
          focusColumnHeader={props.focusColumnHeader}
        >
          {reactTable.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow<TData> row={row} rowNavRoute={props.rowNavRoute} />
              {isDefined(props.subRowColumns) && (
                <TableSubRow<TData>
                  row={row}
                  subRowColumns={props.subRowColumns}
                />
              )}
            </Fragment>
          ))}
        </TableNavigationProvider>
      </JoyTable>
      {props.data.length === 0 && <NoDataComponent />}
    </Stack>
  );
}
