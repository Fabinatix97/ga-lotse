/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDentitionType,
  ApiExamination,
  ApiProphylaxisType,
} from "@eshg/dental-api";
import {
  BaseEntity,
  Versioned,
  mapBaseEntity,
  mapOptional,
  mapVersioned,
} from "@eshg/lib-employee-portal";

import {
  ExaminationResult,
  mapExaminationResult,
} from "../../../../api/models/ExaminationResult";
import {
  ExaminationStatus,
  mapToExaminationStatus,
} from "../../../../api/models/ExaminationStatus";

export interface ChildExamination extends BaseEntity, Versioned {
  readonly dateAndTime: Date;
  readonly prophylaxisType?: ApiProphylaxisType;
  readonly screening: boolean;
  readonly prophylaxisDentitionType?: ApiDentitionType;
  readonly fluoridation: boolean;
  readonly fluoridationConsentGiven?: boolean;
  readonly note?: string;
  readonly result?: ExaminationResult;
  readonly status: ExaminationStatus;
}

export function mapChildExamination(
  response: ApiExamination,
): ChildExamination {
  const result = mapOptional(response.result, mapExaminationResult);
  return {
    ...mapBaseEntity(response),
    ...mapVersioned(response),
    dateAndTime: response.dateAndTime,
    prophylaxisType: response.prophylaxisType,
    screening: response.isScreening,
    prophylaxisDentitionType: response.prophylaxisDentitionType,
    fluoridation: response.isFluoridation,
    fluoridationConsentGiven: response.fluoridationConsentGiven,
    note: response.note,
    result: result,
    status: mapToExaminationStatus(result, response),
  };
}
