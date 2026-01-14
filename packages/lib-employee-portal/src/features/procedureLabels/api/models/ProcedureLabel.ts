/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseEntity, mapBaseEntity } from "../../../../api/models/BaseEntity";
import { Versioned, mapVersioned } from "../../../../api/models/Versioned";

export interface ProcedureLabel extends BaseEntity, Versioned {
  readonly name: string;
  readonly description?: string;
  readonly hexColor: string;
  readonly readonly?: boolean;
}

export interface ProcedureLabelResponse {
  id: string;
  version: number;
  name: string;
  description?: string;
  hexColor: string;
  readonly?: boolean;
}

export function mapProcedureLabel(
  response: ProcedureLabelResponse,
): ProcedureLabel {
  return {
    ...mapBaseEntity(response),
    ...mapVersioned(response),
    name: response.name,
    description: response.description,
    hexColor: response.hexColor,
    readonly: response.readonly,
  };
}

export function mapProcedureLabels(
  response: ProcedureLabelResponse[],
): ProcedureLabel[] {
  return response.map(mapProcedureLabel);
}
