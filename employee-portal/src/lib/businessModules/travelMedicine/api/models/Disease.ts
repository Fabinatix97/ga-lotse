/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDisease } from "@eshg/employee-portal-api/travelMedicine";
import {
  BaseEntity,
  mapBaseEntity,
} from "@eshg/lib-employee-portal/api/models/BaseEntity";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

export interface Disease extends BaseEntity {
  readonly createdAt: Date;
  readonly estimatedFee?: number;
  readonly modifiedAt?: Date;
  readonly name: string;
  readonly visibleToCitizenPortal: boolean;
}

export function mapDisease(response: ApiDisease): Disease {
  return {
    ...mapBaseEntity(response),
    createdAt: response.createdAt,
    estimatedFee: mapOptionalValue(response.estimatedFee),
    modifiedAt: mapOptionalValue(response.modifiedAt),
    name: response.name,
    visibleToCitizenPortal: response.visibleToCitizenPortal,
  };
}
