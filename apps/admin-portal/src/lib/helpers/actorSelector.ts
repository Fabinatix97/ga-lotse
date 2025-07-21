/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminActorSelector } from "@eshg/service-directory-api";

import { Actor, OrgUnit } from "@/lib/hooks/useEntities";

// eslint-disable-next-line func-style
export const filterOrgUnit =
  (selector: ApiAdminActorSelector) => (orgUnit: OrgUnit) => {
    let result = true;
    if (selector.federalState && orgUnit.entity?.federalState) {
      result &&= orgUnit.entity.federalState === selector.federalState;
    }
    if (selector.orgUnitType && orgUnit.entity?.type) {
      result &&= orgUnit.entity.type === selector.orgUnitType;
    }
    if (selector.orgUnitName && orgUnit.entity?.readableName) {
      result &&= orgUnit.entity.readableName === selector.orgUnitName;
    }
    return result;
  };

export function filterActorBySelector(
  selector: ApiAdminActorSelector,
  actor: Actor,
  filterActorName = false,
) {
  let result = true;
  if (actor.entity?._orgUnit?.entity) {
    result &&= filterOrgUnit(selector)(actor.entity._orgUnit);
  }
  if (selector.actorType && actor.entity?.type) {
    result &&= actor.entity.type === selector.actorType;
  }
  if (filterActorName && selector.actorName && actor.entity?.readableName) {
    result &&= actor.entity.readableName === selector.actorName;
  }
  return result;
}

export function formatActorSelector(s: ApiAdminActorSelector) {
  return `${format(s.federalState)}/${format(s.orgUnitType)}/${format(s.orgUnitName)}/${format(s.actorType)}/${format(s.actorName)}`;
}

function format(value: string | undefined): string {
  if (value === undefined) {
    return "*";
  }
  return value;
}

export function isActorSelector(s: unknown): s is ApiAdminActorSelector {
  return (
    typeof s === "object" &&
    s !== null &&
    "federalState" in s &&
    ["string", "undefined"].includes(typeof s.federalState) &&
    "orgUnitType" in s &&
    ["string", "undefined"].includes(typeof s.orgUnitType) &&
    "orgUnitName" in s &&
    ["string", "undefined"].includes(typeof s.orgUnitName) &&
    "actorType" in s &&
    ["string", "undefined"].includes(typeof s.actorType) &&
    "actorName" in s &&
    ["string", "undefined"].includes(typeof s.actorName)
  );
}
