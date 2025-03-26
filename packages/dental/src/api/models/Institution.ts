/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInstitution } from "@eshg/dental-api";
import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";

export interface Institution extends BaseEntity {
  readonly name: string;
}

export function mapInstitution(response: ApiInstitution): Institution {
  return {
    ...mapBaseEntity(response),
    name: response.name,
  };
}
