/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiExaminationResult,
  ApiFluoridationExaminationResult,
  ApiOralHygieneStatus,
  ApiScreeningExaminationResult,
} from "@eshg/dental-api";

export type ChildExaminationResult =
  | FluoridationExaminationResult
  | ScreeningExaminationResult;

export interface FluoridationExaminationResult {
  readonly fluorideVarnishApplied: boolean;
}

export interface ScreeningExaminationResult
  extends FluoridationExaminationResult {
  readonly oralHygieneStatus?: ApiOralHygieneStatus;
}

export function mapChildExaminationResult(
  response: ApiExaminationResult,
): ChildExaminationResult {
  switch (response.type) {
    case "FluoridationExaminationResult":
      return mapFluoridationExaminationResult(response);
    case "ScreeningExaminationResult":
      return mapScreeningExaminationResult(response);
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
