/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiExamination,
  ApiProphylaxisType,
} from "@eshg/employee-portal-api/dental";

import { BaseEntity } from "@/lib/shared/api/models/BaseEntity";

export interface Examination extends BaseEntity {
  readonly dateAndTime: Date;
  readonly prophylaxisType: ApiProphylaxisType;
  readonly note?: string;
  readonly version: number;
}

export function mapExamination(response: ApiExamination): Examination {
  return {
    ...response,
    dateAndTime: response.dateAndTime,
    prophylaxisType: response.prophylaxisType,
    note: response.note,
  };
}
