/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactCategory, ApiInstitution } from "@eshg/dental-api";
import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";

export interface Institution extends BaseEntity {
  readonly category: ApiContactCategory;
  readonly name: string;
}

export function mapInstitution(response: ApiInstitution): Institution {
  return {
    ...mapBaseEntity(response),
    category: response.category,
    name: response.name,
  };
}
