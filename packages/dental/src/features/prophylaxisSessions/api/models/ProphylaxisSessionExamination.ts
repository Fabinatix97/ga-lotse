/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDentitionType,
  ApiFluoridationConsent,
  ApiGender,
  ApiProphylaxisSessionChildExamination,
  ApiScreeningExaminationResult,
} from "@eshg/dental-api";
import {
  ProcedureLabel,
  Versioned,
  mapOptional,
} from "@eshg/lib-employee-portal";

import {
  ExaminationResult,
  ScreeningExaminationResultWithDate,
  mapExaminationResult,
  mapScreeningExaminationResult,
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
  updatePending?: boolean;
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
  readonly previousScreeningExaminations: ScreeningExaminationResultWithDate[];
  readonly procedureLabels: ProcedureLabel[];
}

export function mapProphylaxisSessionExamination(
  response: ApiProphylaxisSessionChildExamination,
  isScreening: boolean,
  isFluoridation: boolean,
): ProphylaxisSessionExamination {
  const result = mapOptional(response.result, mapExaminationResult);
  const currentFluoridationConsent = response.relevantFluoridationConsents[0];
  const isFluoridationConsentGiven = currentFluoridationConsent?.consented;
  return {
    id: response.childId,
    version: response.childVersion,
    examinationId: response.examinationId,
    examinationVersion: response.examinationVersion,
    firstName: response.firstName,
    lastName: response.lastName,
    dateOfBirth: response.dateOfBirth,
    updatePending: response.outdated,
    institution: mapInstitution(response.institution),
    groupName: response.groupName,
    gender: response.gender,
    currentFluoridationConsent: currentFluoridationConsent,
    allFluoridationConsents: response.relevantFluoridationConsents,
    result: result,
    status: mapToExaminationStatus(result, {
      isScreening,
      isFluoridation,
      isFluoridationConsentGiven,
    }),
    note: response.note,
    prophylaxisDentitionType: response.prophylaxisDentitionType,
    previousScreeningExaminations: mapPreviousExaminations(
      response.previousScreeningExaminationResults,
    ),
    procedureLabels: response.procedureLabels,
  };
}

function mapPreviousExaminations(
  response: Record<string, ApiScreeningExaminationResult>,
): ScreeningExaminationResultWithDate[] {
  return Object.entries(response).map(([k, v]) => ({
    result: mapScreeningExaminationResult(v),
    dateAndTime: new Date(k),
  }));
}
