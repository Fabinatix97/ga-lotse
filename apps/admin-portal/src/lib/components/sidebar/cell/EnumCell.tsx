/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, Select } from "@mui/joy";
import { ReactNode, useCallback } from "react";
import { isNullish } from "remeda";

import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import {
  SelectOption,
  SelectOptions,
} from "@/lib/components/table/SelectOptions";
import { useCommitDryRun } from "@/lib/hooks/useCommitDryRun";
import {
  ActorData,
  OrgUnitData,
  RuleData,
  canonicalColumnId,
} from "@/lib/hooks/useEntities";
import { useUpdateEntity } from "@/lib/hooks/useUpdateEntity";

interface EnumCellProps<EData extends OrgUnitData | ActorData | RuleData>
  extends CommonCellProps<EData> {
  options?: string[];
}

export function EnumCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<EnumCellProps<EData>>,
): ReactNode {
  if (!props.editable) {
    return props.entity.entity?.[props.id]?.toString() ?? "";
  }
  return <EditableEnumCell {...props} />;
}

function EditableEnumCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<EnumCellProps<EData>>,
): ReactNode {
  const updateEntity = useUpdateEntity();

  const handleChange = useCallback(
    (_event: unknown, value: string | null) => {
      updateEntity(props.entity, {
        [props.id]: value,
      });
    },
    [updateEntity, props.id, props.entity],
  );

  const options: SelectOption[] =
    props.options?.map((value) => ({
      value: value,
      label: value,
    })) ?? [];

  return (
    <InnerEnumCell
      value={props.entity.entity?.[props.id]?.toString() ?? ""}
      handleChange={handleChange}
      options={options}
      rowId={props.entity.id}
      columnId={props.id.toString()}
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
    !!errorMessage?.columns?.includes(canonicalColumnId(columnId));
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
