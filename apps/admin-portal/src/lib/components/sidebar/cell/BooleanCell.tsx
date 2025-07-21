/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Switch } from "@mui/joy";
import { ChangeEvent, ReactNode, useCallback } from "react";

import { getActiveLabel } from "@/lib/components/sidebar/cell/ActiveCell";
import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { ActorData, OrgUnitData, RuleData } from "@/lib/hooks/useEntities";
import { useUpdateEntity } from "@/lib/hooks/useUpdateEntity";

export function BooleanCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<CommonCellProps<EData>>,
): ReactNode {
  if (!props.editable) {
    return <StaticBooleanCell {...props} />;
  }
  return <EditableBooleanCell {...props} />;
}

function EditableBooleanCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<CommonCellProps<EData>>,
): ReactNode {
  const updateEntity = useUpdateEntity();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateEntity(props.entity, {
        [props.id]: event.target.checked,
      });
    },
    [updateEntity, props.entity, props.id],
  );

  return (
    <Switch
      checked={!!props.entity.entity?.[props.id]}
      onChange={handleChange}
      onClick={(event) => event.stopPropagation()}
    />
  );
}

function StaticBooleanCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<CommonCellProps<EData>>,
): ReactNode {
  return (
    <Stack justifyContent="center" direction="row">
      {getActiveLabel(!!props.entity.entity?.[props.id])}
    </Stack>
  );
}
