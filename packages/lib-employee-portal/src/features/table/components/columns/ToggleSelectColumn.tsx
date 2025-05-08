/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Checkbox, styled } from "@mui/joy";
import { DisplayColumnDef } from "@tanstack/react-table";

export interface ToggleSelectColumnProps {
  ariaLabelSelectAllRows?: string;
  ariaLabelDeselectAllRows?: string;
  ariaLabelSelectRow?: string;
  ariaLabelDeselectRow?: string;
}

export function ToggleSelectColumn(
  props: ToggleSelectColumnProps,
): DisplayColumnDef<unknown> {
  return {
    id: "toggleSelect",
    meta: {
      width: "46px",
      cellStyle: "checkbox",
    },
    header: ({ table }) => (
      <SelectRowCheckbox
        ariaLabelDeselect={
          props.ariaLabelDeselectAllRows ?? "Alle Zeilen abwählen"
        }
        ariaLabelSelect={props.ariaLabelSelectAllRows ?? "Alle Zeilen anwählen"}
        selected={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        toggleSelected={() => table.toggleAllRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <SelectRowCheckbox
        ariaLabelDeselect={props.ariaLabelDeselectRow ?? "Zeile abwählen"}
        ariaLabelSelect={props.ariaLabelSelectRow ?? "Zeile anwählen"}
        selected={row.getIsSelected()}
        toggleSelected={() => row.toggleSelected()}
      />
    ),
  };
}

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  verticalAlign: "top",
  padding: theme.spacing(0.25, 0.75),
}));

interface SelectRowCheckboxProps {
  selected: boolean;
  indeterminate?: boolean;
  toggleSelected: () => void;
  ariaLabelSelect: string;
  ariaLabelDeselect: string;
}

function SelectRowCheckbox(props: SelectRowCheckboxProps) {
  return (
    <StyledCheckbox
      color="primary"
      checked={props.selected}
      indeterminate={props.indeterminate}
      slotProps={{
        input: {
          "aria-label": props.selected
            ? props.ariaLabelDeselect
            : props.ariaLabelSelect,
        },
      }}
      onChange={props.toggleSelected}
    />
  );
}
