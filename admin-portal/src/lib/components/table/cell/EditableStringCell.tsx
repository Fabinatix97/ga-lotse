/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode, useCallback } from "react";
import { isEmpty } from "remeda";

import { DebouncedInput } from "@/lib/components/table/cell/DebouncedInput";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";
import { useEditableRow } from "@/lib/helpers/entityFilter";
import { useCommitDryRun } from "@/lib/hooks/useCommitDryRun";

export function EditableStringCell<TData extends UniqueEntity & EditableEntity>(
  props: Readonly<CellContext<TData, string>>,
): ReactNode {
  const errorMessage = useCommitDryRun();

  const handleChange = useCallback(
    (value: string) => {
      props.table.options.meta?.api?.update({
        ...props.row.original,
        [props.column.id]: value,
      });
    },
    [props.column.id, props.row, props.table.options.meta],
  );

  if (!useEditableRow(props.row)) {
    return props.getValue();
  }

  const value = props.getValue();
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
