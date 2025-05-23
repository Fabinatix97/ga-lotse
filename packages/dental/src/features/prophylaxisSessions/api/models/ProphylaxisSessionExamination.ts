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
import {
  ProcedureLabel,
  Versioned,
  mapOptional,
} from "@eshg/lib-employee-portal";

import {
  ExaminationResult,
  ExaminationResultWithDate,
  mapExaminationResult,
} from "../../../../api/models/ExaminationResult";
import {
  ExaminationStatus,
  mapToExaminationStatus,
} from "../../../../api/models/ExaminationStatus";
import {
  Institution,
  mapInstitution,
} from "../../../../api/models/Institution";

export interface ParticipantDetails extends Versioned {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender?: ApiGender;
  groupName?: string;
  procedureLabels: ProcedureLabel[];
  currentFluoridationConsent?: ApiFluoridationConsent;
}

export interface ProphylaxisSessionExamination extends ParticipantDetails {
  readonly examinationId: string;
  readonly examinationVersion: number;
  readonly institution: Institution;
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
    id: response.childId,
    version: response.childVersion,
    examinationId: response.examinationId,
    examinationVersion: response.examinationVersion,
    firstName: response.firstName,
    lastName: response.lastName,
    dateOfBirth: response.dateOfBirth,
    institution: mapInstitution(response.institution),
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
