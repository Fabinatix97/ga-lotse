/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@tanstack/react-table";

function getVisibleCellWithColId<TData>(
  row: Row<TData>,
  colId: string,
): string | undefined {
  const colValue: unknown = row
    .getVisibleCells()
    .find((c) => {
      return c.column.id === colId;
    })
    ?.getValue();

  if (typeof colValue === "string") {
    return colValue;
  }
  return undefined;
}

export function getRowIdentifier<TData>(row: Row<TData>): string {
  const idVal = getVisibleCellWithColId(row, "id");
  if (idVal !== undefined) {
    const descVal = getVisibleCellWithColId(row, "description");
    if (descVal !== undefined) {
      return `${idVal} (${descVal})`;
    }
    return idVal;
  }

  return getVisibleCellWithColId(row, "readableName") ?? row.id;
}
