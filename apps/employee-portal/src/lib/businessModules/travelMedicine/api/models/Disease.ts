/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseEntity } from "@eshg/lib-employee-portal";

export interface Disease extends BaseEntity {
  readonly createdAt: Date;
  readonly estimatedFee?: number;
  readonly modifiedAt?: Date;
  readonly name: string;
  readonly visibleToCitizenPortal: boolean;
}
