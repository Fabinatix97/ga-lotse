/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatActorSelector } from "@/lib/helpers/actorSelector";
import { isActor, isOrgUnit, isRule } from "@/lib/helpers/entityValidation";
import { Actor, EntityWrapper, OrgUnit, Rule } from "@/lib/hooks/useEntities";

function getOrgUnitName(orgUnit: OrgUnit | undefined) {
  const federalState = orgUnit?.entity?.federalState ?? "";
  const orgUnitType = orgUnit?.entity?.type ?? "";
  const readableName = orgUnit?.entity?.readableName ?? "";

  if (!readableName) return orgUnit?.id ?? "";

  return federalState + "/" + orgUnitType + "/" + readableName;
}

function getActorName(actor: Actor) {
  const orgUnitPart = getOrgUnitName(actor.entity?._orgUnit);
  const actorType = actor.entity?.type ?? "";
  const readableName = actor.entity?.readableName ?? "";

  if (!readableName) return orgUnitPart + "/" + actor.id;

  return orgUnitPart + "/" + actorType + "/" + readableName;
}

function getRuleName(rule: Rule) {
  if (!rule.entity?.client || !rule.entity.server) return rule.id;
  return `${formatActorSelector(rule.entity.client)} → ${formatActorSelector(rule.entity.server)}`;
}

export function entityToString(entity: EntityWrapper, short = false): string {
  const name = isOrgUnit(entity)
    ? getOrgUnitName(entity)
    : isActor(entity)
      ? getActorName(entity)
      : isRule(entity)
        ? getRuleName(entity)
        : "";
  if (!short && !name.includes(entity.id)) {
    return `${name} (${entity.id})`;
  }
  return name;
}

export function entityIdForLink(entity: EntityWrapper): string {
  if (isRule(entity)) {
    return entity.id;
  }
  return entityToString(entity, true);
}
