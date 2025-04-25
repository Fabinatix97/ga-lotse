/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { ApiTooth } from "@eshg/dental-api";

import {
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
} from "@/api/models/ExaminationResult";
import { ALL_TEETH, OPTIONAL_TEETH, RELATED_TEETH } from "@/config/teeth";

import { ToothDiagnosis } from "./ToothDiagnosis";

export type ExaminationStatus = "OPEN" | "CLOSED" | "NOT_PRESENT";

export function mapToExaminationStatus(
  examinationResult: ExaminationResult | undefined,
): ExaminationStatus {
  if (examinationResult === undefined) {
    return "OPEN";
  }
  if (examinationResult.type === "absence") {
    return "NOT_PRESENT";
  }
  return requiredFieldsDefined(examinationResult) ? "CLOSED" : "OPEN";
}

function requiredFieldsDefined(
  examinationResult: ScreeningExaminationResult | FluoridationExaminationResult,
) {
  switch (examinationResult.type) {
    case "screening":
      return (
        isDefined(examinationResult.fluorideVarnishApplied) &&
        allRequiredDiagnosesSet(examinationResult)
      );
    case "fluoridation":
      return isDefined(examinationResult.fluorideVarnishApplied);
    default:
      return false;
  }
}

function allRequiredDiagnosesSet(result: ScreeningExaminationResult) {
  const diagnoses = result.toothDiagnoses;

  return ALL_TEETH.values().every((secondaryTooth) => {
    const primaryTooth = RELATED_TEETH[secondaryTooth];
    const isOptionalTooth = OPTIONAL_TEETH.has(secondaryTooth);
    const toothRemoved = !isDefined(diagnoses[secondaryTooth]);
    return isOptionalTooth
      ? mainResultDefined(diagnoses, secondaryTooth) || toothRemoved
      : mainResultDefined(diagnoses, secondaryTooth) ||
          mainResultDefined(diagnoses, primaryTooth);
  });
}

function mainResultDefined(
  diagnoses: Partial<Record<ApiTooth, ToothDiagnosis>>,
  tooth: ApiTooth | undefined,
) {
  return isDefined(tooth) && isDefined(diagnoses[tooth]?.mainResult);
}
