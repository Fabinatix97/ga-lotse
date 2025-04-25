/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapToObj } from "remeda";

import {
  ApiAbsenceExaminationResult,
  ApiDentitionType,
  ApiExaminationResult,
  ApiFluoridationExaminationResult,
  ApiMihStatus,
  ApiOralHygieneStatus,
  ApiOrthodonticFinding,
  ApiOrthodonticStatus,
  ApiReasonForAbsence,
  ApiScreeningExaminationResult,
  ApiTooth,
} from "@eshg/dental-api";

import { ToothDiagnosis, mapToothDiagnosis } from "./ToothDiagnosis";

export type ExaminationResult =
  | FluoridationExaminationResult
  | ScreeningExaminationResult
  | AbsenceExaminationResult;

export interface ExaminationResultWithDate {
  result: ExaminationResult | undefined;
  dateAndTime: Date;
}

export interface FluoridationExaminationResult {
  readonly type: "fluoridation";
  readonly fluorideVarnishApplied?: boolean;
}

export interface ScreeningExaminationResult {
  readonly type: "screening";
  readonly dentitionType: ApiDentitionType;
  readonly oralHygieneStatus?: ApiOralHygieneStatus;
  readonly mihStatus?: ApiMihStatus;
  readonly orthodonticFindings: ApiOrthodonticFinding[];
  readonly orthodonticStatus?: ApiOrthodonticStatus;
  readonly fluorideVarnishApplied?: boolean;
  readonly plaque: boolean;
  readonly calculus: boolean;
  readonly gingivitis: boolean;
  readonly parodontitis: boolean;
  readonly toothDiagnoses: ToothDiagnoses;
}

export type ToothDiagnoses = Partial<Record<ApiTooth, ToothDiagnosis>>;

export interface AbsenceExaminationResult {
  readonly type: "absence";
  readonly reasonForAbsence: ApiReasonForAbsence;
}

export function mapExaminationResult(
  response: ApiExaminationResult,
): ExaminationResult {
  switch (response.type) {
    case "FluoridationExaminationResult":
      return mapFluoridationExaminationResult(response);
    case "ScreeningExaminationResult":
      return mapScreeningExaminationResult(response);
    case "AbsenceExaminationResult":
      return mapAbsenceExaminationResult(response);
  }
}

function mapFluoridationExaminationResult(
  response: ApiFluoridationExaminationResult,
): FluoridationExaminationResult {
  return {
    type: "fluoridation",
    fluorideVarnishApplied: response.fluorideVarnishApplied,
  };
}

function mapScreeningExaminationResult(
  response: ApiScreeningExaminationResult,
): ScreeningExaminationResult {
  return {
    type: "screening",
    dentitionType: response.dentitionType,
    oralHygieneStatus: response.oralHygieneStatus,
    mihStatus: response.mihStatus,
    orthodonticFindings: response.orthodonticFindings,
    orthodonticStatus: response.orthodonticStatus,
    fluorideVarnishApplied: response.fluorideVarnishApplied,
    plaque: response.plaque,
    calculus: response.calculus,
    gingivitis: response.gingivitis,
    parodontitis: response.parodontitis,
    toothDiagnoses: mapToObj(
      response.toothDiagnoses,
      (toothDiagnosisResponse) => [
        toothDiagnosisResponse.tooth,
        mapToothDiagnosis(toothDiagnosisResponse),
      ],
    ),
  };
}

function mapAbsenceExaminationResult(
  response: ApiAbsenceExaminationResult,
): AbsenceExaminationResult {
  return {
    type: "absence",
    reasonForAbsence: response.reasonForAbsence,
  };
}
