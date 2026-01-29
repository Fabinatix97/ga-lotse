/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode, useCallback } from "react";
import { isEmpty } from "remeda";

import { DebouncedInput } from "@/lib/components/formFields/DebouncedInput";
import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { useCommitDryRun } from "@/lib/hooks/useCommitDryRun";
import {
  ActorData,
  OrgUnitData,
  RuleData,
  canonicalColumnId,
} from "@/lib/hooks/useEntities";
import { useUpdateEntity } from "@/lib/hooks/useUpdateEntity";

interface StringCellProps<
  EData extends OrgUnitData | ActorData | RuleData,
> extends CommonCellProps<EData> {
  optional?: boolean;
}

export function StringCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<StringCellProps<EData>>,
): ReactNode {
  if (props.editable) {
    return <EditableStringCell {...props} />;
  }
  return props.entity.entity?.[props.id]?.toString() ?? "";
}

function EditableStringCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<StringCellProps<EData>>,
) {
  const errorMessage = useCommitDryRun();
  const updateEntity = useUpdateEntity();

  const handleChange = useCallback(
    (value: string) => {
      updateEntity(props.entity, {
        [props.id]: value,
      });
    },
    [updateEntity, props.id, props.entity],
  );

  const value = props.entity.entity?.[props.id]?.toString() ?? "";
  const serverError =
    !!errorMessage?.ids.includes(props.entity.id) &&
    !!errorMessage?.columns?.includes(canonicalColumnId(props.id.toString()));
  const color =
    serverError || (!props.optional && isEmpty(value)) ? "danger" : undefined;

  return (
    <DebouncedInput
      size="sm"
      color={color}
      value={value}
      timeoutMs={500}
      label={props.id.toString()}
      onChange={handleChange}
      onClick={(event) => event.stopPropagation()}
    />
  );
}
