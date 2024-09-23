/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDoctorLetterValue,
  ApiExaminationResult,
  ApiExaminationResultValue,
} from "@eshg/employee-portal-api/schoolEntry";

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
