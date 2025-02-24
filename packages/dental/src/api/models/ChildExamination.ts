/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiFluoridationConsent,
  ApiGender,
  ApiProphylaxisSessionChildExamination,
} from "@eshg/dental-api";
import { mapOptional } from "@eshg/lib-employee-portal/api/models/utils";

import { ExaminationResult, mapExaminationResult } from "./ExaminationResult";
import { ExaminationStatus, mapToExaminationStatus } from "./ExaminationStatus";

export interface ChildExamination {
  readonly childId: string;
  readonly examinationId: string;
  readonly examinationVersion: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: Date;
  readonly groupName: string;
  readonly gender?: ApiGender;
  readonly currentFluoridationConsent?: ApiFluoridationConsent;
  readonly allFluoridationConsents: ApiFluoridationConsent[];
  readonly status: ExaminationStatus;
  readonly result?: ExaminationResult;
  readonly note?: string;
}

export function mapChildExamination(
  response: ApiProphylaxisSessionChildExamination,
): ChildExamination {
  return {
    childId: response.childId,
    examinationId: response.examinationId,
    examinationVersion: response.examinationVersion,
    firstName: response.firstName,
    lastName: response.lastName,
    dateOfBirth: response.dateOfBirth,
    groupName: response.groupName,
    gender: response.gender,
    currentFluoridationConsent: response.allFluoridationConsents[0],
    allFluoridationConsents: response.allFluoridationConsents,
    status: mapToExaminationStatus(response.result),
    result: mapOptional(response.result, mapExaminationResult),
    note: response.note,
  };
}
