/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { sortedIndexBy } from "remeda";

import {
  ApiAdminActor,
  ApiAdminActorMetadata,
  type ApiAdminActorSelector,
  ApiAdminOrgUnit,
  type ApiAdminPartialActor,
  ApiAdminPartialOrgUnit,
  ApiAdminPartialRule,
  ApiAdminRule,
  ApiAdminStagedEntityAdminPartialActor,
  ApiAdminStagedEntityAdminPartialOrgUnit,
  ApiAdminStagedEntityAdminPartialRule,
  ApiAdminStagedEntityType,
  ApiGetEntitiesResponse,
  type ApiStagingStatus,
  ServiceDirectoryAdminApi,
} from "@eshg/service-directory-api";

import { BackendError, useAdminApi } from "@/lib/api/clients";
import {
  filterActorBySelector,
  filterOrgUnit,
} from "@/lib/helpers/actorSelector";
import { minutes } from "@/lib/helpers/datetime";

export interface StagedEntity<T = unknown> {
  id: string;
  entity?: T;
  _type: "orgUnit" | "actor" | "rule";

  stagedEntityType: ApiAdminStagedEntityType;
  originalEntityId?: string;
  author: string;
  stagingStatus: ApiStagingStatus;
  _parent?: CommittedEntity<T>;
}

export interface UniqueEntity {
  id: string;
}

export interface CommittedEntity<T = unknown> {
  id: string;
  entity: T;
  _type: "orgUnit" | "actor" | "rule";

  _staged: StagedEntity<T>[];
}

export type EntityWrapper<T = unknown> = StagedEntity<T> | CommittedEntity<T>;

export function canonicalColumnId(columnId: string): string {
  return columnId.startsWith("entity.") ? columnId.slice(7) : columnId;
}

export function isStagedEntity<T>(
  entity: EntityWrapper<T> | OrgUnit | Actor | Rule,
): entity is StagedEntity<T> {
  return "stagedEntityType" in entity;
}

export function isCommittedEntity<T>(
  entity: EntityWrapper<T>,
): entity is CommittedEntity<T> {
  return !("stagedEntityType" in entity);
}

export const NEW_ENTITY_PARENT_ID = "NEW_ENTITY_PARENT_ID";
export const ORG_UNIT_WILDCARD_ID = "ORG_UNIT_WILDCARD_ID";
export const ENTITIES_QUERY = ["entities"];

function sortById<T extends UniqueEntity>(e: T[]): T[] {
  return e.sort((a, b) => a.id.localeCompare(b.id));
}

function fetchEntities(
  adminApi: ServiceDirectoryAdminApi,
): () => Promise<ApiGetEntitiesResponse> {
  return async (): Promise<ApiGetEntitiesResponse> => {
    return await adminApi
      .getAllEntities()
      .catch((error: BackendError | Error) => {
        if (error.message.startsWith("Failed to fetch"))
          throw new Error("FetchFailed");
        if ("status" in error) throw new Error(error.status.toString());
        else throw new Error(error.message);
      });
  };
}

export function useEntitiesQuery() {
  const adminApi = useAdminApi();

  return useQuery({
    queryKey: ENTITIES_QUERY,
    queryFn: fetchEntities(adminApi),
    refetchOnWindowFocus: true,
    refetchInterval: minutes(1),
    throwOnError: false,
  });
}

function insertSorted<T extends UniqueEntity>(list: T[], element: T) {
  const idx = sortedIndexBy(list, element, (x) => x.id);
  list.splice(idx, 0, element);
}

function insertStagedEntitiesIntoParent<T>(
  stagedOrgUnits: Record<string, StagedEntity<T>>,
  committedOrgUnits: Record<string, CommittedEntity<T>>,
  empty: () => T,
) {
  const newOrgUnitParent: CommittedEntity<T> = {
    id: NEW_ENTITY_PARENT_ID,
    _staged: [],
    entity: empty(),
    _type: "orgUnit",
  };
  Object.values(stagedOrgUnits).forEach((sou) => {
    if (!sou._parent) {
      insertSorted(newOrgUnitParent._staged, sou);
    } else {
      sou._parent._staged.push(sou);
    }
  });
  if (newOrgUnitParent._staged.length > 0) {
    committedOrgUnits[NEW_ENTITY_PARENT_ID] = newOrgUnitParent;
  }
}

export type OrgUnitData = Omit<ApiAdminPartialOrgUnit, "id"> & {
  _actors: EntityWrapper<ApiAdminPartialActor>[];
};
export type OrgUnit = EntityWrapper<OrgUnitData>;

export type ActorData = Omit<
  ApiAdminPartialActor,
  "id" | "orgUnitId" | "stagingStatus"
> & {
  metadata?: ApiAdminActorMetadata;
  _orgUnit?: OrgUnit;
  _matchingClientRules: Rule[];
  _matchingServerRules: Rule[];
};
export type Actor = EntityWrapper<ActorData>;

export type RuleData = Omit<ApiAdminPartialRule, "id"> & {
  _exactOrgUnitIds: string[];
  _matchingClientActors: Actor[];
  _matchingServerActors: Actor[];
};
export type Rule = EntityWrapper<RuleData>;

export function useEntities(): {
  committedOrgUnits: CommittedEntity<OrgUnitData>[];
  stagedOrgUnits: StagedEntity<OrgUnitData>[];
  allOrgUnits: OrgUnit[];
  committedActors: CommittedEntity<ActorData>[];
  stagedActors: StagedEntity<ActorData>[];
  allActors: Actor[];
  committedRules: CommittedEntity<RuleData>[];
  stagedRules: StagedEntity<RuleData>[];
  allRules: Rule[];
} {
  const { data, isPending, isError } = useEntitiesQuery();

  return useMemo(() => {
    if (isPending || isError) {
      return {
        committedOrgUnits: [],
        stagedOrgUnits: [],
        allOrgUnits: [],
        committedActors: [],
        stagedActors: [],
        allActors: [],
        committedRules: [],
        stagedRules: [],
        allRules: [],
      };
    }

    const committedOrgUnits: Record<
      string,
      CommittedEntity<OrgUnitData>
    > = Object.fromEntries(
      data.orgUnits
        .map((ou) => ({ ...ou, _actors: [] }))
        .map((ou) => wrapEntity(ou, "orgUnit"))
        .map((ou) => [ou.id, ou]),
    );
    const stagedOrgUnits: Record<
      string,
      StagedEntity<OrgUnitData>
    > = Object.fromEntries(
      data.stagedOrgUnits
        .map((sou) => enrichOrgUnit(sou, committedOrgUnits))
        .map((sou) => [sou.id, sou]),
    );
    const allOrgUnits: Record<string, OrgUnit> = {
      ...committedOrgUnits,
      ...stagedOrgUnits,
    };
    const committedActors: Record<
      string,
      CommittedEntity<ActorData>
    > = Object.fromEntries(
      data.orgUnits
        .flatMap((ou) => ou.actors.map((a) => ({ ...a, orgUnitId: ou.id })))
        .map((a) => ({
          ...a,
          _orgUnit: allOrgUnits[a.orgUnitId],
          _matchingServerRules: [],
          _matchingClientRules: [],
        }))
        .map((a) => wrapEntity(a, "actor"))
        .map((a) => [a.id, a]),
    );
    const stagedActors: Record<
      string,
      StagedEntity<ActorData>
    > = Object.fromEntries(
      data.stagedActors
        .map((sa) => enrichActor(sa, committedActors, allOrgUnits))
        .map((sa) => [sa.id, sa]),
    );
    const allActors: Record<string, Actor> = {
      ...committedActors,
      ...stagedActors,
    };
    const committedRules: Record<
      string,
      CommittedEntity<RuleData>
    > = Object.fromEntries(
      data.rules
        .map((r) => ({
          ...r,
          _exactOrgUnitIds: [],
          _matchingClientActors: [],
          _matchingServerActors: [],
        }))
        .map((r) => wrapEntity(r, "rule"))
        .map((r) => [r.id, r]),
    );
    const stagedRules: Record<
      string,
      StagedEntity<RuleData>
    > = Object.fromEntries(
      data.stagedRules
        .map((r) => enrichRule(r, committedRules))
        .map((sr) => [sr.id, sr]),
    );
    const allRules: Record<string, Rule> = {
      ...committedRules,
      ...stagedRules,
    };

    Object.values(allOrgUnits).forEach((ou) => {
      if (!ou.entity) return;
      ou.entity._actors = Object.values(committedActors).filter((a) =>
        hasId(ou, a.entity?._orgUnit?.id),
      );
    });
    Object.values(allActors).forEach((a) => {
      if (!a.entity) return;
      a.entity._matchingServerRules = Object.values(allRules).filter((r) =>
        filterActorBySelector(r.entity?.server ?? {}, a),
      );
      a.entity._matchingClientRules = Object.values(allRules).filter((r) =>
        filterActorBySelector(r.entity?.client ?? {}, a),
      );
    });
    Object.values(allRules).forEach((r) => {
      if (!r.entity) return;
      r.entity._exactOrgUnitIds = Object.values(allOrgUnits)
        .filter(
          (ou) =>
            filterOrgUnitExact(r.entity?.client, ou) ||
            filterOrgUnitExact(r.entity?.server, ou),
        )
        .map((ou) => ou.id);
      if (
        selectorHasOrgUnitWildCard(r.entity?.client) ||
        selectorHasOrgUnitWildCard(r.entity?.server)
      ) {
        r.entity._exactOrgUnitIds.push(ORG_UNIT_WILDCARD_ID);
      }
      r.entity._matchingClientActors = Object.values(allActors).filter((a) =>
        filterActorBySelector(r.entity?.client ?? {}, a),
      );
      r.entity._matchingServerActors = Object.values(allActors).filter((a) =>
        filterActorBySelector(r.entity?.server ?? {}, a),
      );
    });

    insertStagedEntitiesIntoParent(stagedOrgUnits, committedOrgUnits, () => ({
      _actors: [],
    }));
    insertStagedEntitiesIntoParent(stagedActors, committedActors, () => ({}));
    insertStagedEntitiesIntoParent(stagedRules, committedRules, () => ({}));

    return {
      committedOrgUnits: sortById(Object.values(committedOrgUnits)),
      stagedOrgUnits: sortById(Object.values(stagedOrgUnits)),
      allOrgUnits: sortById(Object.values(allOrgUnits)),
      committedActors: sortById(Object.values(committedActors)),
      stagedActors: sortById(Object.values(stagedActors)),
      allActors: sortById(Object.values(allActors)),
      committedRules: sortById(Object.values(committedRules)),
      stagedRules: sortById(Object.values(stagedRules)),
      allRules: sortById(Object.values(allRules)),
    };
  }, [data, isPending, isError]);
}

function hasId(
  entity: EntityWrapper<unknown>,
  id: string | undefined,
): boolean {
  if (isStagedEntity(entity) && entity._parent) {
    return entity.id === id || entity._parent.id === id;
  }
  return entity.id === id;
}

function wrapEntity<T extends ApiAdminOrgUnit | ApiAdminActor | ApiAdminRule>(
  e: T,
  type: "orgUnit" | "actor" | "rule",
): CommittedEntity<T> {
  return {
    id: e.id,
    entity: e,
    _type: type,
    _staged: [],
  };
}

function enrichOrgUnit(
  orgUnit: ApiAdminStagedEntityAdminPartialOrgUnit,
  committedOrgUnits: Record<string, CommittedEntity<OrgUnitData>>,
): StagedEntity<OrgUnitData> {
  return {
    ...orgUnit,
    entity: orgUnit.entity
      ? {
          ...orgUnit.entity,
          _actors: [],
        }
      : undefined,
    _parent: orgUnit.originalEntityId
      ? committedOrgUnits[orgUnit.originalEntityId]
      : undefined,
    _type: "orgUnit",
  };
}

function enrichActor(
  actor: ApiAdminStagedEntityAdminPartialActor,
  committedActors: Record<string, CommittedEntity<ActorData>>,
  allOrgUnits: Record<string, OrgUnit>,
): StagedEntity<ActorData> {
  return {
    ...actor,
    entity: actor.entity
      ? {
          ...actor.entity,
          _orgUnit: actor.entity.orgUnitId
            ? allOrgUnits[actor.entity.orgUnitId]
            : undefined,
          _matchingServerRules: [],
          _matchingClientRules: [],
        }
      : undefined,
    _parent: actor.originalEntityId
      ? committedActors[actor.originalEntityId]
      : undefined,
    _type: "actor",
  };
}

function enrichRule(
  rule: ApiAdminStagedEntityAdminPartialRule,
  committedRules: Record<string, CommittedEntity<RuleData>>,
): StagedEntity<RuleData> {
  return {
    ...rule,
    entity: rule.entity
      ? {
          ...rule.entity,
          _exactOrgUnitIds: [],
          _matchingClientActors: [],
          _matchingServerActors: [],
        }
      : undefined,
    _parent: rule.originalEntityId
      ? committedRules[rule.originalEntityId]
      : undefined,
    _type: "rule",
  };
}

function filterOrgUnitExact(
  selector: ApiAdminActorSelector | undefined,
  orgUnit: OrgUnit,
): boolean {
  if (selectorHasOrgUnitWildCard(selector)) return false;
  return filterOrgUnit(selector!)(orgUnit);
}

function selectorHasOrgUnitWildCard(
  selector: ApiAdminActorSelector | undefined,
): boolean {
  return (
    !selector?.federalState || !selector?.orgUnitType || !selector?.orgUnitName
  );
}
