/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Table as JoyTable, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import {
  TableOptions,
  Table as TanstackTable,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useEffect, useState } from "react";

import { TableApi } from "@/lib/components/table/EditableTable";
import { EmptyTableHint } from "@/lib/components/table/EmptyTableHint";
import { TableRow } from "@/lib/components/table/TableRow";
import { TableHead } from "@/lib/components/table/head/TableHead";
import { UniqueEntity } from "@/lib/helpers/entities";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    width?: number | string;
    headerLabel?: string;
    cellStyle?: CellStyle;
    options?: TValue[];
    multiFilter?: boolean;
    stringToValue?: (value: string) => TValue;
    linkTo?: string;
    optional?: boolean;
  }

  interface TableMeta<TData> {
    updateData: (update: TData & UniqueEntity) => void;
    api?: TableApi<TData>;
  }
}

export type CellStyle = "button";

export interface TableProps<TData> {
  data: TableOptions<TData>["data"];
  columns: TableOptions<TData>["columns"];
  initialColumnVisibility?: VisibilityState;
}

export function Table<TData extends UniqueEntity>(
  props: Readonly<TableProps<TData>>,
) {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const tableConfig: TableOptions<TData> = {
    data: data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    sortDescFirst: false,
    initialState: {
      columnVisibility: props.initialColumnVisibility,
    },
  };
  const reactTable: TanstackTable<TData> = useReactTable(tableConfig);

  const tableStyle: SxProps = {
    "--TableCell-paddingY": (theme) => theme.spacing(1),
    "--TableCell-paddingX": (theme) => theme.spacing(1.5),
    tableLayout: "auto",
  };

  return (
    <Stack flexDirection="column" spacing={2}>
      <JoyTable stickyHeader noWrap sx={tableStyle} stripe="even">
        <TableHead
          enableColumnHeaders={true}
          enableColumnFilter={false}
          reactTable={reactTable}
        />
        <tbody>
          {
            <EmptyTableHint
              empty={!data.length}
              allFiltered={!reactTable.getRowModel().rows.length}
              columns={reactTable.getAllColumns().length}
            />
          }
          {reactTable.getRowModel().rows.map((row) => {
            return (
              <Fragment key={row.id}>
                <TableRow<TData> row={row} />
              </Fragment>
            );
          })}
        </tbody>
      </JoyTable>
    </Stack>
  );
}
