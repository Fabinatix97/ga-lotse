/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAbsenceExaminationResult,
  ApiDentitionType,
  ApiExaminationResult,
  ApiFluoridationExaminationResult,
  ApiOralHygieneStatus,
  ApiReasonForAbsence,
  ApiScreeningExaminationResult,
  ApiTooth,
} from "@eshg/dental-api";
import { mapToObj } from "remeda";

import { ToothDiagnosis, mapToothDiagnosis } from "./ToothDiagnosis";

export type ExaminationResult =
  | FluoridationExaminationResult
  | ScreeningExaminationResult
  | AbsenceExaminationResult;

export interface FluoridationExaminationResult {
  readonly type: "fluoridation";
  readonly fluorideVarnishApplied?: boolean;
}

export interface ScreeningExaminationResult {
  readonly type: "screening";
  readonly dentitionType: ApiDentitionType;
  readonly oralHygieneStatus?: ApiOralHygieneStatus;
  readonly fluorideVarnishApplied?: boolean;
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
    fluorideVarnishApplied: response.fluorideVarnishApplied,
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

type FieldFunctionMap<T> = {
  [K in keyof T]-?: (value: T[K]) => boolean;
};

function isUndefined<T>(data: T | undefined) {
  return data === undefined;
}

const screeningResultEmptinessChecks: FieldFunctionMap<ScreeningExaminationResult> =
  {
    type: (value) => {
      return value === "screening";
    },
    oralHygieneStatus: isUndefined,
    fluorideVarnishApplied: isUndefined,
    dentitionType: () => true,
    toothDiagnoses: (value) => {
      return Object.keys(value).length === 0;
    },
  };

const fluoridationResultEmptinessChecks: FieldFunctionMap<FluoridationExaminationResult> =
  {
    type: (value) => {
      return value === "fluoridation";
    },
    fluorideVarnishApplied: isUndefined,
  };

function isEmptyResult<T extends ExaminationResult>(
  examinationResult: T,
  emptinessChecks: { [K in keyof T]: (val: T[K]) => boolean },
): boolean {
  const keys = Object.keys(examinationResult) as (keyof T)[];
  return keys.every((key) => {
    const isEmpty = emptinessChecks[key];
    const value = examinationResult[key];
    return isEmpty(value);
  });
}

function isEmptyScreeningExaminationResult(
  result: ScreeningExaminationResult,
): boolean {
  return isEmptyResult(result, screeningResultEmptinessChecks);
}

function isEmptyFluoridationExaminationResult(
  result: FluoridationExaminationResult,
): boolean {
  return isEmptyResult(result, fluoridationResultEmptinessChecks);
}

export function isEmptyExaminationResult(
  result: ScreeningExaminationResult | FluoridationExaminationResult,
): boolean {
  if (result.type === "screening") {
    return isEmptyScreeningExaminationResult(result);
  } else {
    return isEmptyFluoridationExaminationResult(result);
  }
}
