/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";
import { ApiSchoolEntryLabel } from "@eshg/school-entry-api";

export interface Label extends BaseEntity {
  readonly version: number;
  readonly name: string;
  readonly description?: string;
  readonly hexColor: string;
  readonly readonly: boolean;
}

export function mapLabel(response: ApiSchoolEntryLabel): Label {
  return {
    ...mapBaseEntity(response),
    version: response.version,
    name: response.name,
    description: response.description,
    hexColor: response.hexColor,
    readonly: response.readonly,
  };
}

export function mapLabels(response: ApiSchoolEntryLabel[]): Label[] {
  return response.map(mapLabel);
}
