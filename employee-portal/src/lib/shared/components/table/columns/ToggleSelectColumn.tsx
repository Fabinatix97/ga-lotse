/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Checkbox, styled } from "@mui/joy";
import { DisplayColumnDef } from "@tanstack/react-table";

export const ToggleSelectColumn: DisplayColumnDef<unknown> = {
  id: "toggleSelect",
  meta: {
    width: "46px",
    headerLabel: "Zeile an-/abwählen",
    cellStyle: "checkbox",
  },
  header: ({ table }) => (
    <SelectRowCheckbox
      header
      targetName="Alle Zeilen"
      selected={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      toggleSelected={() => table.toggleAllRowsSelected()}
    />
  ),
  cell: ({ row }) => (
    <SelectRowCheckbox
      targetName="Zeile"
      selected={row.getIsSelected()}
      toggleSelected={() => row.toggleSelected()}
    />
  ),
};

interface StyledCheckboxProps {
  header?: boolean;
}

const StyledCheckbox = styled(Checkbox)<StyledCheckboxProps>(({ theme }) => ({
  verticalAlign: "top",
  padding: theme.spacing(0.25, 0.75),
}));

interface SelectRowCheckboxProps extends StyledCheckboxProps {
  targetName: string;
  selected: boolean;
  indeterminate?: boolean;
  toggleSelected: () => void;
}

function SelectRowCheckbox(props: SelectRowCheckboxProps) {
  return (
    <StyledCheckbox
      header={props.header}
      color="primary"
      checked={props.selected}
      indeterminate={props.indeterminate}
      onChange={props.toggleSelected}
      slotProps={{
        input: {
          "aria-label": props.selected
            ? `${props.targetName} abwählen`
            : `${props.targetName} anwählen`,
        },
      }}
    />
  );
}
