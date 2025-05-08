/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, Select } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ReactNode, useCallback } from "react";
import { isNullish } from "remeda";

import {
  ApiAdminActorType,
  ApiAdminOrgUnitType,
  ApiFederalState,
} from "@eshg/service-directory-api";

import {
  SelectOption,
  SelectOptions,
} from "@/lib/components/table/SelectOptions";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import { useEditableRow } from "@/lib/helpers/entityFilter";
import { useCommitDryRun } from "@/lib/hooks/useCommitDryRun";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { Rule } from "@/lib/hooks/useRules";

export function EditableEnumCell(
  props:
    | Readonly<
        CellContext<
          OrgUnit,
          ApiAdminOrgUnitType | ApiAdminActorType | ApiFederalState
        >
      >
    | Readonly<
        CellContext<
          Actor,
          ApiAdminOrgUnitType | ApiAdminActorType | ApiFederalState
        >
      >
    | Readonly<
        CellContext<
          Rule,
          ApiAdminOrgUnitType | ApiAdminActorType | ApiFederalState
        >
      >,
): ReactNode {
  const handleChange = useCallback(
    (_event: unknown, value: string | null) => {
      props.table.options.meta?.api?.update({
        id: props.row.original.id,
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
        value={value ?? null}
        slotProps={{
          button: {
            id: "multi-select-button-" + columnId,
            "aria-labelledby": columnId,
          },
        }}
        onChange={handleChange}
        onClick={(event) => event.stopPropagation()}
      >
        <SelectOptions options={options} />
      </Select>
    </FormControl>
  );
}
