/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode, useCallback, useMemo } from "react";

import { EntityLink } from "@/lib/components/layout/nav/EntityLink";
import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { InnerEnumCell } from "@/lib/components/sidebar/cell/EnumCell";
import { SelectOption } from "@/lib/components/table/SelectOptions";
import { getAdminName } from "@/lib/helpers/adminName";
import { entityToString } from "@/lib/helpers/entityToString";
import {
  ActorData,
  NEW_ENTITY_PARENT_ID,
  isCommittedEntity,
  useEntities,
} from "@/lib/hooks/useEntities";
import { useUpdateEntity } from "@/lib/hooks/useUpdateEntity";

export function OrgUnitCell(
  props: Readonly<CommonCellProps<ActorData>>,
): ReactNode {
  if (props.editable) {
    return <EditableOrgUnitCell {...props} />;
  }
  return <StaticOrgUnitCell {...props} />;
}

function EditableOrgUnitCell(
  props: Readonly<CommonCellProps<ActorData>>,
): ReactNode {
  const updateEntity = useUpdateEntity();

  const handleChange = useCallback(
    (_event: unknown, value: string | null) => {
      updateEntity(props.entity, {
        orgUnitId: value ?? undefined,
      });
    },
    [updateEntity, props.entity],
  );

  const { allOrgUnits } = useEntities();

  const adminName = getAdminName();
  const orgUnitWithoutStagedFromOther = useMemo(
    () =>
      allOrgUnits
        .filter((ou) => ou.id !== NEW_ENTITY_PARENT_ID)
        .filter((ou) => isCommittedEntity(ou) || ou.author === adminName),
    [allOrgUnits, adminName],
  );

  const options: SelectOption[] = orgUnitWithoutStagedFromOther.map((ou) => ({
    value: ou.id,
    label: entityToString(ou),
  }));

  return (
    <InnerEnumCell
      value={props.entity.entity?._orgUnit?.id}
      handleChange={handleChange}
      options={options}
      rowId={props.entity.id}
      columnId={props.id}
    />
  );
}

function StaticOrgUnitCell(
  props: Readonly<CommonCellProps<ActorData>>,
): ReactNode {
  const value = props.entity.entity?._orgUnit;
  if (!value) {
    return false;
  }

  const naturalOrgUnitId = entityToString(value, true);

  return (
    <EntityLink linkTo="org-units" value={naturalOrgUnitId}>
      {entityToString(value, true)}
    </EntityLink>
  );
}
