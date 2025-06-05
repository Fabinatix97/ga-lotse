/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseEntity } from "@eshg/lib-employee-portal";

export interface OtherServicesTemplates extends BaseEntity {
  readonly createdAt: Date;
  readonly description: string;
  readonly fee?: number;
  readonly modifiedAt: Date;
}
