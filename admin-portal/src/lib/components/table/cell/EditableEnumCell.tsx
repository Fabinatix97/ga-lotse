/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminActorType,
  ApiAdminOrgUnitType,
  ApiFederalState,
} from "@eshg/admin-portal-api/serviceDirectory";
import { FormControl, Select } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ReactNode, useCallback } from "react";
import { isNullish } from "remeda";

import {
  SelectOption,
  SelectOptions,
} from "@/lib/components/table/SelectOptions";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";
import { useEditableRow } from "@/lib/helpers/entityFilter";
import { useCommitDryRun } from "@/lib/hooks/useCommitDryRun";

export function EditableEnumCell<TData extends UniqueEntity & EditableEntity>(
  props: Readonly<
    CellContext<
      TData,
      ApiAdminOrgUnitType | ApiAdminActorType | ApiFederalState
    >
  >,
): ReactNode {
  const handleChange = useCallback(
    (_event: unknown, value: string | null) => {
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

  const options: SelectOption[] =
    props.column.columnDef.meta?.options?.map((value) => ({
      value: value,
      label: value,
    })) ?? [];

  return (
    <InnerEnumCell
      value={props.getValue()}
      handleChange={handleChange}
      options={options}
      rowId={props.row.original.id}
      columnId={props.column.id}
    />
  );
}

export function InnerEnumCell({
  value,
  handleChange,
  options,
  rowId,
  columnId,
}: Readonly<{
  value: string | undefined;
  handleChange: (_event: unknown, value: string | null) => void;
  options: SelectOption[];
  rowId: string;
  columnId: string;
}>) {
  const errorMessage = useCommitDryRun();

  const serverError =
    !!errorMessage?.ids.includes(rowId) &&
    !!errorMessage?.columns?.includes(columnId);
  const color = serverError || isNullish(value) ? "danger" : undefined;

  return (
    <FormControl>
      <Select
        sx={{ display: "inline-flex" }}
        size="sm"
        color={color}
        onChange={handleChange}
        onClick={(event) => event.stopPropagation()}
        value={value ?? null}
        slotProps={{
          button: {
            id: "multi-select-button-" + columnId,
            "aria-labelledby": columnId,
          },
        }}
      >
        <SelectOptions options={options} />
      </Select>
    </FormControl>
  );
}
