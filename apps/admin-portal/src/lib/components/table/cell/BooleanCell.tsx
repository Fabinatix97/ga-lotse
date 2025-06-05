/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Switch } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ChangeEvent, ReactNode, useCallback } from "react";

import { getActiveLabel } from "@/lib/components/table/cell/ActiveCell";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import { useEditableRow } from "@/lib/helpers/entityFilter";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { Rule } from "@/lib/hooks/useRules";

export function BooleanCell(
  props: Readonly<CellContext<Actor, boolean>>,
): ReactNode {
  if (!useEditableRow(props.row)) {
    return <StaticBooleanCell {...props} />;
  }
  return <EditableBooleanCell {...props} />;
}

function EditableBooleanCell(
  props: Readonly<CellContext<Actor, boolean>>,
): ReactNode {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      props.table.options.meta?.api?.update({
        id: props.row.original.id,
        [props.column.id]: event.target.checked,
      });
    },
    [props.row, props.table.options.meta, props.column.id],
  );

  return (
    <Switch
      checked={props.getValue()}
      onChange={handleChange}
      onClick={(event) => event.stopPropagation()}
    />
  );
}

function StaticBooleanCell<TData extends OrgUnit | Actor | Rule>(
  props: CellContext<TData, boolean>,
): ReactNode {
  return (
    <Stack justifyContent="center" direction="row">
      {getActiveLabel(props.getValue())}
    </Stack>
  );
}
