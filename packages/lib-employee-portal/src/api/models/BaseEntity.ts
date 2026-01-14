/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BaseEntity {
  readonly id: string;
}

interface BaseEntityProps {
  id: string;
}

export function mapBaseEntity(response: BaseEntityProps): BaseEntity {
  return { id: response.id };
}

export function getEntityId(entity: BaseEntity): string {
  return entity.id;
}

export function isSameEntity(a: BaseEntity, b: BaseEntity): boolean {
  return a.id === b.id;
}
