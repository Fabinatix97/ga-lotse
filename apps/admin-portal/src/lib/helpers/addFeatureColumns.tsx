/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import {
  CellContext,
  DisplayColumnDef,
  Row,
  TableOptions,
} from "@tanstack/react-table";
import { ReactNode } from "react";

import { getRowIdentifier } from "@/lib/helpers/table";
import { useTranslation } from "@/lib/i18n/client";

export const TOGGLE_EXPAND_ID = "toggleExpand";
const TOGGLE_EXPAND_COLUMN: DisplayColumnDef<unknown> = {
  id: TOGGLE_EXPAND_ID,
  meta: {
    cellStyle: "button",
  },
  cell: ExpandButtonCell,
};

function ExpandButtonCell<TData, TValue>({
  row,
}: Readonly<CellContext<TData, TValue>>): ReactNode {
  return <ExpandButton row={row} />;
}

export function ExpandButton<TData>({
  row,
}: Readonly<{
  row: Row<TData>;
}>): ReactNode {
  const { t } = useTranslation();

  if (!row.getCanExpand()) {
    return null;
  }

  const labelAction = row.getIsExpanded() ? t("collapseRow") : t("expandRow");
  const labelId = getRowIdentifier(row);

  return (
    <IconButton
      size="sm"
      aria-label={labelAction + " " + labelId}
      onClick={(event) => {
        event.stopPropagation();
        row.getToggleExpandedHandler()();
      }}
    >
      {row.getIsExpanded() ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
    </IconButton>
  );
}

export function addFeatureColumns<TData>(
  columns: TableOptions<TData>["columns"],
  features: { toggleExpand: boolean },
): TableOptions<TData>["columns"] {
  if (features.toggleExpand) {
    return [TOGGLE_EXPAND_COLUMN as DisplayColumnDef<TData>, ...columns];
  }

  return columns;
}
