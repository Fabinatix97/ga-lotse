/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiExaminationResult,
  ApiEyeExaminationResult,
  ApiEyeExaminationType,
  ApiPercentageValue,
} from "@eshg/employee-portal-api/schoolEntry";

import {
  ExaminationResult,
  mapExaminationResult,
} from "@/lib/businessModules/schoolEntry/api/models/examinations/ExaminationResult";
import { Versioned, mapVersioned } from "@/lib/shared/api/models/Versioned";

export interface EyeExaminationResult extends Versioned {
  leftEye: EyeExamination;
  rightEye: EyeExamination;
  eyeExamination: ApiExaminationResult;
  ishiharaExamination: ExaminationResult;
  langExamination: ExaminationResult;
  amblyopia: boolean;
  astigmatism: boolean;
  colorVisionDisorder: boolean;
  hyperopia: boolean;
  myopia: boolean;
  otherDiagnosis: boolean;
  strabismus: boolean;
  note?: string;
}

type EyeExamination = Record<ApiEyeExaminationType, ApiPercentageValue>;

export function mapEyeExaminationResult(
  response: ApiEyeExaminationResult,
): EyeExaminationResult {
  return {
    ...mapVersioned(response),
    leftEye: response.leftEye as EyeExamination,
    rightEye: response.rightEye as EyeExamination,
    eyeExamination: mapExaminationResult(response.eyeExamination),
    ishiharaExamination: mapExaminationResult(response.ishiharaExamination),
    langExamination: mapExaminationResult(response.langExamination),
    amblyopia: response.amblyopia,
    astigmatism: response.astigmatism,
    colorVisionDisorder: response.colorVisionDisorder,
    hyperopia: response.hyperopia,
    myopia: response.myopia,
    otherDiagnosis: response.otherDiagnosis,
    strabismus: response.strabismus,
    note: response.note,
  };
}
