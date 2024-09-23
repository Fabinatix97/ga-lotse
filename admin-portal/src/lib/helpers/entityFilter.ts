/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiStagingStatus,
  instanceOfApiAdminStagedEntityAdminPartialActor,
  instanceOfApiAdminStagedEntityAdminPartialOrgUnit,
  instanceOfApiAdminStagedEntityAdminPartialRule,
} from "@eshg/admin-portal-api/serviceDirectory";
import { Row } from "@tanstack/react-table";

import { useEditableTable } from "@/lib/components/table/context/TableEditContext";
import { StagedActorWithEntityId } from "@/lib/components/view/actors/ActorTable";
import { getAdminName } from "@/lib/helpers/adminName";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";
import { StagedOrgUnitWithEntityId } from "@/lib/hooks/useOrgUnits";
import { StagedRuleWithEntityId } from "@/lib/hooks/useRules";

export type OneOfStagedEntity =
  | StagedOrgUnitWithEntityId
  | StagedActorWithEntityId
  | StagedRuleWithEntityId;

export function isOneOfStagedEntity(
  entity: UniqueEntity & { author?: string },
): entity is OneOfStagedEntity {
  return (
    instanceOfApiAdminStagedEntityAdminPartialOrgUnit(entity) ||
    instanceOfApiAdminStagedEntityAdminPartialActor(entity) ||
    instanceOfApiAdminStagedEntityAdminPartialRule(entity)
  );
}

export function useEditableRow<TData extends UniqueEntity & EditableEntity>(
  row: Row<TData>,
): boolean {
  return (
    useEditableTable() &&
    isOneOfStagedEntity(row.original) &&
    row.original.stagingStatus === ApiStagingStatus.WorkInProgress &&
    row.original.author === getAdminName()
  );
}
