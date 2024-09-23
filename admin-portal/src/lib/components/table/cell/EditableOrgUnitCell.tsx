/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode, useCallback, useMemo } from "react";

import { SelectOption } from "@/lib/components/table/SelectOptions";
import { InnerEnumCell } from "@/lib/components/table/cell/EditableEnumCell";
import { LinkCell } from "@/lib/components/table/cell/LinkCell";
import { getAdminName } from "@/lib/helpers/adminName";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";
import { useEditableRow } from "@/lib/helpers/entityFilter";
import { entityToString } from "@/lib/helpers/entityToString";
import { PartialOrgUnitWithId, useOrgUnits } from "@/lib/hooks/useOrgUnits";

export function EditableOrgUnitCell<
  TData extends UniqueEntity & EditableEntity,
>(
  props: Readonly<CellContext<TData, PartialOrgUnitWithId | undefined>>,
): ReactNode {
  const handleChange = useCallback(
    (_event: unknown, value: string | null) => {
      props.table.options.meta?.api?.update({
        ...props.row.original,
        orgUnitId: value,
      });
    },
    [props.row, props.table.options.meta],
  );

  const orgUnits = useOrgUnits();

  const adminName = getAdminName();
  const orgUnitWithoutStagedFromOther = useMemo(
    () =>
      orgUnits.filter(
        (o) =>
          o.stagingStatus === undefined ||
          ("author" in o && o.author == adminName),
      ),
    [orgUnits, adminName],
  );

  if (!useEditableRow(props.row)) {
    return <LinkCell {...props} />;
  }

  const options: SelectOption[] = orgUnitWithoutStagedFromOther.map((ou) => ({
    value: ou.id,
    label: entityToString(ou),
  }));

  return (
    <InnerEnumCell
      value={props.getValue()?.id}
      handleChange={handleChange}
      options={options}
      rowId={props.row.original.id}
      columnId={props.column.id}
    />
  );
}
