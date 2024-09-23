/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { EntityLink } from "@/lib/components/layout/nav/EntityLink";
import { entityToString } from "@/lib/helpers/entityToString";
import { PartialOrgUnitWithId } from "@/lib/hooks/useOrgUnits";

export function LinkCell<TData>(
  props: CellContext<TData, PartialOrgUnitWithId | undefined>,
): ReactNode {
  const value = props.getValue();
  if (!value) {
    return false;
  }

  const naturalOrgUnitId = value
    ? value.federalState + "/" + value.type + "/" + value.readableName
    : "";

  return (
    <EntityLink
      linkTo={props.column.columnDef.meta?.linkTo}
      value={naturalOrgUnitId}
    >
      {entityToString(value, true)}
    </EntityLink>
  );
}
