/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { ApiVaccine } from "@eshg/travel-medicine-api";

import {
  Disease,
  mapDisease,
} from "@/lib/businessModules/travelMedicine/api/models/Disease";

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

export function mapVaccines(response: ApiVaccine): Vaccines {
  return {
    ...mapBaseEntity(response),
    createdAt: response.createdAt,
    currentBatchId: mapOptionalValue(response.currentBatchId),
    disease: mapDisease(response.disease),
    fee: mapOptionalValue(response.fee),
    inventoryVaccineId: response.inventoryVaccineId,
    modifiedAt: response.modifiedAt,
    name: response.name,
    numVaccinations: response.numVaccinations,
    offsets: response.offsets,
  };
}
