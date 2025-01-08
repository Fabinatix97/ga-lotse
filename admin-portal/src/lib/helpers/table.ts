/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@tanstack/react-table";

import { Actor } from "@/lib/components/view/actors/ActorTable";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { Rule } from "@/lib/hooks/useRules";

function getVisibleCellWithColId<TData>(
  row: Row<TData> | Row<OrgUnit> | Row<Actor> | Row<Rule>,
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

export function getRowIdentifier<TData>(
  row: Row<TData> | Row<OrgUnit> | Row<Actor> | Row<Rule>,
): string {
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
