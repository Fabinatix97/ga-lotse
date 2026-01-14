/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { EntityLink } from "@/lib/components/layout/nav/EntityLink";
import { entityToString } from "@/lib/helpers/entityToString";
import { Actor, OrgUnit } from "@/lib/hooks/useEntities";

export function OrgUnitCell(
  props: Readonly<CellContext<Actor, OrgUnit | undefined>>,
): ReactNode {
  const value = props.getValue();
  if (!value) {
    return false;
  }

  const naturalOrgUnitId = entityToString(value, true);

  return (
    <EntityLink linkTo="org-units" value={naturalOrgUnitId}>
      {value.entity?.readableName ?? ""}
    </EntityLink>
  );
}
