/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode, useCallback } from "react";
import { isEmpty } from "remeda";

import { DebouncedInput } from "@/lib/components/table/cell/DebouncedInput";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import { useEditableRow } from "@/lib/helpers/entityFilter";
import { useCommitDryRun } from "@/lib/hooks/useCommitDryRun";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { Rule } from "@/lib/hooks/useRules";

export function StringCell(
  props:
    | Readonly<CellContext<OrgUnit, string>>
    | Readonly<CellContext<Actor, string>>
    | Readonly<CellContext<Rule, string>>,
): ReactNode {
  if (useEditableRow(props.row)) {
    return <EditableStringCell {...props} />;
  }
  return props.getValue();
}

function EditableStringCell(
  props:
    | Readonly<CellContext<OrgUnit, string>>
    | Readonly<CellContext<Actor, string>>
    | Readonly<CellContext<Rule, string>>,
) {
  const errorMessage = useCommitDryRun();

  const handleChange = useCallback(
    (value: string) => {
      props.table.options.meta?.api?.update({
        id: props.row.original.id,
        [props.column.id]: value,
      });
    },
    [props.column.id, props.row, props.table.options.meta],
  );

  const value = props.getValue() ?? "";
  const serverError =
    !!errorMessage?.ids.includes(props.row.original.id) &&
    !!errorMessage?.columns?.includes(props.column.id);
  const color =
    serverError || (!props.column.columnDef.meta?.optional && isEmpty(value))
      ? "danger"
      : undefined;

  return (
    <DebouncedInput
      size="sm"
      color={color}
      value={value}
      onChange={handleChange}
      onClick={(event) => event.stopPropagation()}
      timeoutMs={500}
      label={props.column.id}
    />
  );
}
