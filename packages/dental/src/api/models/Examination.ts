/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiExamination, ApiProphylaxisType } from "@eshg/dental-api";
import {
  BaseEntity,
  mapBaseEntity,
} from "@eshg/lib-employee-portal/api/models/BaseEntity";
import {
  Versioned,
  mapVersioned,
} from "@eshg/lib-employee-portal/api/models/Versioned";
import { mapOptional } from "@eshg/lib-employee-portal/api/models/utils";

import { ExaminationResult, mapExaminationResult } from "./ExaminationResult";
import { ExaminationStatus, mapToExaminationStatus } from "./ExaminationStatus";

export interface Examination extends BaseEntity, Versioned {
  readonly dateAndTime: Date;
  readonly prophylaxisType: ApiProphylaxisType;
  readonly screening: boolean;
  readonly fluoridation: boolean;
  readonly fluoridationConsentGiven?: boolean;
  readonly note?: string;
  readonly result?: ExaminationResult;
  readonly status: ExaminationStatus;
}

export function mapExamination(response: ApiExamination): Examination {
  return {
    ...mapBaseEntity(response),
    ...mapVersioned(response),
    dateAndTime: response.dateAndTime,
    prophylaxisType: response.prophylaxisType,
    screening: response.isScreening,
    fluoridation: response.isFluoridation,
    fluoridationConsentGiven: response.fluoridationConsentGiven,
    note: response.note,
    result: mapOptional(response.result, mapExaminationResult),
    status: mapToExaminationStatus(response.result),
  };
}
