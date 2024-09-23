/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Switch } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ChangeEvent, ReactNode, useCallback } from "react";

import {
  ActiveCell,
  InteractiveActiveCell,
} from "@/lib/components/table/cell/ActiveCell";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import {
  isOneOfStagedEntity,
  useEditableRow,
} from "@/lib/helpers/entityFilter";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { Rule } from "@/lib/hooks/useRules";

export function EditableActiveCell<TData extends OrgUnit | Actor | Rule>(
  props: Readonly<CellContext<TData, boolean>>,
): ReactNode {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      props.table.options.meta?.api?.update({
        ...props.row.original,
        active: event.target.checked,
      });
    },
    [props.row, props.table.options.meta],
  );

  const isEditableRow = useEditableRow(props.row);

  if (!isOneOfStagedEntity(props.row.original)) {
    return <InteractiveActiveCell {...props} />;
  }

  if (isEditableRow) {
    return <ActiveCell {...props} />;
  }

  const value = props.getValue();

  return (
    <Switch
      checked={value}
      onChange={handleChange}
      onClick={(event) => event.stopPropagation()}
    />
  );
}
