/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDecibelValue,
  ApiHearingTestResult,
  ApiHertzValue,
} from "@eshg/employee-portal-api/schoolEntry";

import {
  ExaminationResult,
  mapExaminationResult,
} from "@/lib/businessModules/schoolEntry/api/models/examinations/ExaminationResult";
import { Versioned, mapVersioned } from "@/lib/shared/api/models/Versioned";

export interface HearingTestResult extends Versioned {
  leftEar: HearingTest;
  rightEar: HearingTest;
  examinationResult: ExaminationResult;
  note?: string;
}

type HearingTest = Record<ApiHertzValue, ApiDecibelValue>;

export function mapHearingTestResult(
  response: ApiHearingTestResult,
): HearingTestResult {
  return {
    ...mapVersioned(response),
    leftEar: response.leftEar as HearingTest,
    rightEar: response.rightEar as HearingTest,
    examinationResult: mapExaminationResult(response.examinationResult),
    note: response.note,
  };
}
