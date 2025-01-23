/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiExamination, ApiProphylaxisType } from "@eshg/dental-api";

import {
  ExaminationStatus,
  mapToExaminationStatus,
} from "@/lib/businessModules/dental/api/models/ExaminationStatus";
import { BaseEntity } from "@/lib/shared/api/models/BaseEntity";

export interface Examination extends BaseEntity {
  readonly dateAndTime: Date;
  readonly prophylaxisType: ApiProphylaxisType;
  readonly note?: string;
  readonly version: number;
  readonly status: ExaminationStatus;
}

export function mapExamination(response: ApiExamination): Examination {
  return {
    ...response,
    dateAndTime: response.dateAndTime,
    prophylaxisType: response.prophylaxisType,
    note: response.note,
    status: mapToExaminationStatus(response.result),
  };
}
