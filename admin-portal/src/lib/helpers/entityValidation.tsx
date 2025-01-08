/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmpty } from "remeda";

import { DeleteRow } from "@/lib/components/table/DeleteRow";
import { PartialActorWithId } from "@/lib/components/view/actors/ActorTable";
import { OverridableEntity, UniqueEntity } from "@/lib/helpers/entities";
import { PartialOrgUnitWithId } from "@/lib/hooks/useOrgUnits";
import { PartialRuleWithId } from "@/lib/hooks/useRules";

function isActor(entity: UniqueEntity): entity is PartialActorWithId {
  return Object.keys(entity).includes("orgUnitId");
}

function isOrgUnit(entity: UniqueEntity): entity is PartialOrgUnitWithId {
  return Object.keys(entity).includes("actors");
}

function isRule(entity: UniqueEntity): entity is PartialRuleWithId {
  return Object.keys(entity).includes("client");
}

export function isValidEntity<TData>(
  entity: UniqueEntity & OverridableEntity<TData>,
) {
  if (entity._override === DeleteRow) {
    return true;
  }
  if (isActor(entity)) {
    return isValidActor(entity);
  }
  if (isOrgUnit(entity)) {
    return isValidOrgUnit(entity);
  }
  if (isRule(entity)) {
    return isValidRule(entity);
  }
  // eslint-disable-next-line no-console
  console.error("Unexpected entity:", entity);
  return false;
}

function isValidOrgUnit(orgUnit: PartialOrgUnitWithId) {
  return (
    orgUnit.active != null &&
    !isEmpty(orgUnit.readableName) &&
    orgUnit.type != null
  );
}

export function isValidActor(actor: PartialActorWithId) {
  return (
    actor.active != null &&
    !isEmpty(actor.commonName) &&
    !isEmpty(actor.readableName) &&
    actor.type != null
  );
}

function isValidRule(rule: PartialRuleWithId) {
  return rule.active != null;
}
