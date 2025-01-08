/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Cell, Row } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { SubRowColumns } from "@/lib/shared/components/table/DataTable";

export function TableSubRow<TData>({
  row,
  subRowColumns,
}: Readonly<{
  row: Row<TData>;
  subRowColumns: SubRowColumns<TData>;
}>) {
  return (
    <tr>
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
        if (isDefined(subRowColumns[cell.column.id]?.renderCell)) {
          return (
            <td key={cell.id} {...subRowColumns[cell.column.id]!.tdProps}>
              {subRowColumns[cell.column.id]?.renderCell!(cell)}
            </td>
          );
        } else if (!subRowColumns[cell.column.id]?.skip) {
          return <td key={cell.id}></td>;
        }
      })}
    </tr>
  );
}
