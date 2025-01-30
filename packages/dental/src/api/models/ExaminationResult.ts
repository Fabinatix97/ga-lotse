/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAbsenceExaminationResult,
  ApiExaminationResult,
  ApiFluoridationExaminationResult,
  ApiOralHygieneStatus,
  ApiReasonForAbsence,
  ApiScreeningExaminationResult,
} from "@eshg/dental-api";

export type ExaminationResult =
  | FluoridationExaminationResult
  | ScreeningExaminationResult
  | AbsenceExaminationResult;

export interface FluoridationExaminationResult {
  readonly type: "fluoridation";
  readonly fluorideVarnishApplied: boolean;
}

export interface ScreeningExaminationResult {
  readonly type: "screening";
  readonly oralHygieneStatus?: ApiOralHygieneStatus;
  readonly fluorideVarnishApplied: boolean;
}

export interface AbsenceExaminationResult {
  readonly type: "absence";
  readonly reasonForAbsence?: ApiReasonForAbsence;
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
    oralHygieneStatus: response.oralHygieneStatus,
    fluorideVarnishApplied: response.fluorideVarnishApplied,
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
