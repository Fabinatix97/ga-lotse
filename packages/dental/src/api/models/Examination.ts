/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDentalExaminationResult,
  ApiExamination,
  ApiProphylaxisType,
} from "@eshg/dental-api";
import { BaseEntity } from "@eshg/lib-employee-portal/api/models/BaseEntity";

import { ExaminationStatus, mapToExaminationStatus } from "./ExaminationStatus";

export interface Examination extends BaseEntity {
  readonly dateAndTime: Date;
  readonly prophylaxisType: ApiProphylaxisType;
  readonly screening: boolean;
  readonly fluoridation: boolean;
  readonly note?: string;
  readonly result?: ApiDentalExaminationResult;
  readonly version: number;
  readonly status: ExaminationStatus;
}

export function mapExamination(response: ApiExamination): Examination {
  return {
    ...response,
    dateAndTime: response.dateAndTime,
    prophylaxisType: response.prophylaxisType,
    screening: response.screening,
    fluoridation: response.fluoridation,
    note: response.note,
    result: response.result,
    status: mapToExaminationStatus(response.result),
  };
}
