/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { ActiveCell as InnerActiveCell } from "@/lib/components/sidebar/cell/ActiveCell";
import {
  ActorData,
  EntityWrapper,
  OrgUnitData,
  RuleData,
} from "@/lib/hooks/useEntities";

export function ActiveCell<
  TData extends EntityWrapper<OrgUnitData | ActorData | RuleData>,
>(props: Readonly<CellContext<TData, boolean>>): ReactNode {
  return (
    <InnerActiveCell id="active" editable={false} entity={props.row.original} />
  );
}
