/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminActorSelector } from "@eshg/admin-portal-api/serviceDirectory";

import { formatActorSelector } from "@/lib/components/table/cell/ActorSelectorCell";

interface Entity {
  id: string;
  readableName?: string;
  author?: string;
  client?: ApiAdminActorSelector;
  server?: ApiAdminActorSelector;
  naturalId?: string;
}

export type EntityLike =
  | Entity
  | {
      id: string;
      entity: Entity;
    };

function getS(short: boolean, id: string) {
  return short ? "" : ` (${id})`;
}

function getRuleName(entity: Entity, short: boolean, id: string) {
  return entity.client && entity.server
    ? `${formatActorSelector(entity.client)} → ${formatActorSelector(entity.server)}${getS(short, id)}`
    : id;
}

function getName(entity: Entity, short: boolean, id: string) {
  return entity.readableName
    ? `${entity.readableName}${getS(short, id)}`
    : getRuleName(entity, short, id);
}

export function entityToString(entity: EntityLike, short = false): string {
  if ("entity" in entity) {
    return entity.entity ? entityToString(entity.entity, short) : entity.id;
  }
  const id = entity.author ?? entity.id;
  return entity.naturalId
    ? `${entity.naturalId}${getS(short, id)}`
    : getName(entity, short, id);
}
