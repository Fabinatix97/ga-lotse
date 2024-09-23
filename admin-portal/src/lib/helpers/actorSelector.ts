/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminActorSelector } from "@eshg/admin-portal-api/serviceDirectory";

import { PartialActorWithId } from "@/lib/components/view/actors/ActorTable";
import { PartialOrgUnitWithId, useOrgUnitsById } from "@/lib/hooks/useOrgUnits";

// eslint-disable-next-line func-style
export const filterOrgUnit =
  (selector: ApiAdminActorSelector) => (orgUnit: PartialOrgUnitWithId) => {
    let result = true;
    if (selector.federalState && orgUnit.federalState) {
      result &&= orgUnit.federalState === selector.federalState;
    }
    if (selector.orgUnitType && orgUnit.type) {
      result &&= orgUnit.type === selector.orgUnitType;
    }
    if (selector.orgUnitName && orgUnit.readableName) {
      result &&= orgUnit.readableName === selector.orgUnitName;
    }
    return result;
  };

export function useFilterActorBySelector(filterActorName = false) {
  const orgUnits = useOrgUnitsById();
  return (selector: ApiAdminActorSelector, actor: PartialActorWithId) => {
    let result = true;
    const orgUnit = actor.orgUnitId ? orgUnits[actor.orgUnitId] : undefined;
    if (orgUnit) {
      result &&= filterOrgUnit(selector)(orgUnit);
    }
    if (selector.actorType && actor.type) {
      result &&= actor.type === selector.actorType;
    }
    if (filterActorName && selector.actorName && actor.readableName) {
      result &&= actor.readableName === selector.actorName;
    }
    return result;
  };
}
