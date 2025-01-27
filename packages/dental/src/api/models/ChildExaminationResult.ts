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

export type ChildExaminationResult =
  | FluoridationExaminationResult
  | ScreeningExaminationResult
  | AbsenceExaminationResult;

export interface FluoridationExaminationResult {
  readonly fluorideVarnishApplied: boolean;
}

export interface ScreeningExaminationResult
  extends FluoridationExaminationResult {
  readonly oralHygieneStatus?: ApiOralHygieneStatus;
}

export interface AbsenceExaminationResult {
  readonly reasonForAbsence?: ApiReasonForAbsence;
}

export function mapChildExaminationResult(
  response: ApiExaminationResult,
): ChildExaminationResult {
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
    fluorideVarnishApplied: response.fluorideVarnishApplied,
  };
}

function mapScreeningExaminationResult(
  response: ApiScreeningExaminationResult,
): ScreeningExaminationResult {
  return {
    ...mapFluoridationExaminationResult(response),
    oralHygieneStatus: response.oralHygieneStatus,
  };
}

function mapAbsenceExaminationResult(
  response: ApiAbsenceExaminationResult,
): AbsenceExaminationResult {
  return {
    reasonForAbsence: response.reasonForAbsence,
  };
}
