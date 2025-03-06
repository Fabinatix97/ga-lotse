/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTooth } from "@eshg/dental-api";
import { isDefined } from "remeda";

import {
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
} from "@/api/models/ExaminationResult";
import { ToothDiagnosis } from "@/api/models/ToothDiagnosis";
import { RELATED_TEETH } from "@/config/teeth";

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
        allRequiredDiagnosesSet(examinationResult.toothDiagnoses)
      );
    case "fluoridation":
      return isDefined(examinationResult.fluorideVarnishApplied);
    default:
      return false;
  }
}

const requiredSecondaryTeeth = new Set<ApiTooth>([
  "T11",
  "T12",
  "T13",
  "T14",
  "T15",
  "T21",
  "T22",
  "T23",
  "T24",
  "T25",
  "T31",
  "T32",
  "T33",
  "T34",
  "T35",
  "T41",
  "T42",
  "T43",
  "T44",
  "T45",
]);

function allRequiredDiagnosesSet(
  diagnoses: Partial<Record<ApiTooth, ToothDiagnosis>>,
) {
  return requiredSecondaryTeeth.values().every((secondaryTooth) => {
    const primaryTooth = RELATED_TEETH[secondaryTooth];
    return (
      (isDefined(diagnoses[secondaryTooth]) &&
        isDefined(diagnoses[secondaryTooth].mainResult)) ||
      (isDefined(primaryTooth) &&
        isDefined(diagnoses[primaryTooth]?.mainResult))
    );
  });
}
