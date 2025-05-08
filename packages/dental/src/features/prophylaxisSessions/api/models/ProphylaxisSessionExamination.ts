/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDentitionType,
  ApiExaminationResult,
  ApiFluoridationConsent,
  ApiGender,
  ApiProphylaxisSessionChildExamination,
} from "@eshg/dental-api";
import { ProcedureLabel, mapOptional } from "@eshg/lib-employee-portal";

import {
  ExaminationResult,
  ExaminationResultWithDate,
  mapExaminationResult,
} from "../../../../api/models/ExaminationResult";
import {
  ExaminationStatus,
  mapToExaminationStatus,
} from "../../../../api/models/ExaminationStatus";

export interface ProphylaxisSessionExamination {
  readonly childId: string;
  readonly examinationId: string;
  readonly examinationVersion: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: Date;
  readonly institutionName: string;
  readonly groupName?: string;
  readonly gender?: ApiGender;
  readonly currentFluoridationConsent?: ApiFluoridationConsent;
  readonly allFluoridationConsents: ApiFluoridationConsent[];
  readonly status: ExaminationStatus;
  readonly result?: ExaminationResult;
  readonly note?: string;
  readonly prophylaxisDentitionType?: ApiDentitionType;
  readonly previousExaminations: ExaminationResultWithDate[];
  readonly procedureLabels: ProcedureLabel[];
}

export function mapProphylaxisSessionExamination(
  response: ApiProphylaxisSessionChildExamination,
): ProphylaxisSessionExamination {
  const result = mapOptional(response.result, mapExaminationResult);
  return {
    childId: response.childId,
    examinationId: response.examinationId,
    examinationVersion: response.examinationVersion,
    firstName: response.firstName,
    lastName: response.lastName,
    dateOfBirth: response.dateOfBirth,
    institutionName: response.institutionName,
    groupName: response.groupName,
    gender: response.gender,
    currentFluoridationConsent: response.allFluoridationConsents[0],
    allFluoridationConsents: response.allFluoridationConsents,
    result: result,
    status: mapToExaminationStatus(result),
    note: response.note,
    prophylaxisDentitionType: response.prophylaxisDentitionType,
    previousExaminations: mapPreviousExaminations(
      response.previousExaminationResults,
    ),
    procedureLabels: response.procedureLabels,
  };
}

function mapPreviousExaminations(
  response: Record<string, ApiExaminationResult>,
): ExaminationResultWithDate[] {
  return Object.entries(response).map(([k, v]) => ({
    result: mapExaminationResult(v),
    dateAndTime: new Date(k),
  }));
}
