/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
