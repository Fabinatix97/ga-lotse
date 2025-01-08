/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOtherServiceTemplate } from "@eshg/employee-portal-api/travelMedicine";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

import { BaseEntity, mapBaseEntity } from "@/lib/shared/api/models/BaseEntity";

export interface OtherServicesTemplates extends BaseEntity {
  readonly createdAt: Date;
  readonly description: string;
  readonly fee?: number;
  readonly modifiedAt: Date;
}

export function mapOtherServicesTemplates(
  response: ApiOtherServiceTemplate,
): OtherServicesTemplates {
  return {
    ...mapBaseEntity(response),
    createdAt: response.createdAt,
    description: response.description,
    fee: mapOptionalValue(response.fee),
    modifiedAt: response.modifiedAt,
  };
}
