/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ActorData,
  EntityWrapper,
  OrgUnitData,
  RuleData,
} from "@/lib/hooks/useEntities";

export interface CommonCellProps<
  EData extends OrgUnitData | ActorData | RuleData =
    | OrgUnitData
    | ActorData
    | RuleData,
> {
  id: keyof EData;
  editable: boolean;
  entity: EntityWrapper<EData>;
}
