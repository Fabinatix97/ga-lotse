/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { CellContext, DisplayColumnDef } from "@tanstack/react-table";

export const ToggleExpandColumn: DisplayColumnDef<unknown> = {
  id: "toggleExpand",
  meta: {
    width: "48px",
    headerLabel: "Zeile ein-/ausklappen",
    cellStyle: "button",
  },
  cell: ToggleExpandButton,
};

function ToggleExpandButton(props: CellContext<unknown, unknown>) {
  if (!props.row.getCanExpand()) {
    return null;
  }

  return (
    <IconButton
      size="sm"
      aria-label={
        props.row.getIsExpanded() ? "Zeile einklappen" : "Zeile ausklappen"
      }
      onClick={props.row.getToggleExpandedHandler()}
    >
      {props.row.getIsExpanded() ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
    </IconButton>
  );
}
