/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseEntity } from "@eshg/lib-employee-portal";

import { Disease } from "@/lib/businessModules/travelMedicine/api/models/Disease";

export interface Vaccines extends BaseEntity {
  readonly createdAt: Date;
  readonly currentBatchId?: string;
  readonly disease: Disease;
  readonly fee?: number;
  readonly inventoryVaccineId: string;
  readonly modifiedAt: Date;
  readonly name: string;
  readonly numVaccinations: number;
  readonly offsets: number[];
}
