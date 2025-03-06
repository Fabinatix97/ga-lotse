/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { ApiDisease } from "@eshg/travel-medicine-api";

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
