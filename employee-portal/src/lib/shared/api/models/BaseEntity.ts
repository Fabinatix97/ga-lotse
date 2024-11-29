/**
 * Copyright 2024 cronn GmbH
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
