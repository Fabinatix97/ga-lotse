/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiStagingStatus,
  instanceOfApiAdminStagedEntityAdminPartialActor,
  instanceOfApiAdminStagedEntityAdminPartialOrgUnit,
  instanceOfApiAdminStagedEntityAdminPartialRule,
} from "@eshg/service-directory-api";
import { Row } from "@tanstack/react-table";

import { useEditableTable } from "@/lib/components/table/context/TableEditContext";
import {
  Actor,
  StagedActorWithEntityId,
} from "@/lib/components/view/actors/ActorTable";
import { getAdminName } from "@/lib/helpers/adminName";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";
import { OrgUnit, StagedOrgUnitWithEntityId } from "@/lib/hooks/useOrgUnits";
import { Rule, StagedRuleWithEntityId } from "@/lib/hooks/useRules";

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

export function isEditableRow<TData extends UniqueEntity & EditableEntity>(
  row: Row<TData> | Row<OrgUnit> | Row<Actor> | Row<Rule>,
): boolean {
  return (
    isOneOfStagedEntity(row.original) &&
    row.original.stagingStatus === ApiStagingStatus.WorkInProgress &&
    row.original.author === getAdminName()
  );
}

export function useEditableRow<TData extends UniqueEntity & EditableEntity>(
  row: Row<TData> | Row<OrgUnit> | Row<Actor> | Row<Rule>,
): boolean {
  return useEditableTable() && isEditableRow(row);
}
