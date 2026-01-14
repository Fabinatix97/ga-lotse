/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { CellContext, DisplayColumnDef, Row } from "@tanstack/react-table";
import { ReactNode } from "react";

import { entityToString } from "@/lib/helpers/entityToString";
import { EntityWrapper } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

export const TOGGLE_EXPAND_ID = "toggleExpand";

export function getToggleExpandColumn<
  TData extends EntityWrapper,
>(): DisplayColumnDef<TData> {
  return {
    id: TOGGLE_EXPAND_ID,
    meta: {
      cellStyle: "button",
    },
    cell: ExpandButtonCell,
  };
}

function ExpandButtonCell<TData extends EntityWrapper, TValue>({
  row,
}: Readonly<CellContext<TData, TValue>>): ReactNode {
  return <ExpandButton row={row} />;
}

export function ExpandButton<TData extends EntityWrapper>({
  row,
}: Readonly<{
  row: Row<TData>;
}>): ReactNode {
  const { t } = useTranslation();

  if (!row.getCanExpand()) {
    return null;
  }

  const labelAction = row.getIsExpanded() ? t("collapseRow") : t("expandRow");
  const labelId = entityToString(row.original);

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
