/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDoctorLetterValue,
  ApiExaminationResult,
  ApiExaminationResultValue,
} from "@eshg/school-entry-api";

export interface ExaminationResult {
  examinationResultValue?: ApiExaminationResultValue;
  doctorLetterValue?: ApiDoctorLetterValue;
}

export function mapExaminationResult(
  response: ApiExaminationResult,
): ExaminationResult {
  return {
    examinationResultValue: response.examinationResultValue,
    doctorLetterValue: response.doctorLetterValue,
  };
}
