/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmpty } from "remeda";

import { ApiAdminStagedEntityType } from "@eshg/service-directory-api";

import {
  Actor,
  EntityWrapper,
  OrgUnit,
  Rule,
  isStagedEntity,
} from "@/lib/hooks/useEntities";

export function isActor(entity: { _type: string }): entity is Actor {
  return entity._type === "actor";
}

export function isOrgUnit(entity: { _type: string }): entity is OrgUnit {
  return entity._type === "orgUnit";
}

export function isRule(entity: { _type: string }): entity is Rule {
  return entity._type === "rule";
}

export function isValidEntity<TData>(entity: EntityWrapper<TData>) {
  if (
    isStagedEntity(entity) &&
    entity.stagedEntityType === ApiAdminStagedEntityType.Del
  ) {
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

function isValidOrgUnit(orgUnit: OrgUnit) {
  return (
    orgUnit.entity?.active !== undefined &&
    !isEmpty(orgUnit.entity.readableName) &&
    orgUnit.entity.type !== undefined
  );
}

export function isValidActor(actor: Actor) {
  return (
    actor.entity?.active !== undefined &&
    !isEmpty(actor.entity.commonName) &&
    !isEmpty(actor.entity.readableName) &&
    actor.entity.type !== undefined
  );
}

function isValidRule(rule: Rule) {
  return rule.entity?.active !== undefined;
}
