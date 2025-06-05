/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMainResult } from "@eshg/dental-api";

import { QUADRANT_NUMBERS } from "../../../stores/examination/constants";
import {
  AddableTooth,
  Dentition,
  Tooth,
  ToothType,
  ToothWithDiagnosis,
} from "../../../stores/examination/types";

const TREATMENT_REQUIRED_VALUES = [
  ApiMainResult.D,
  ApiMainResult.Z,
  ApiMainResult.W,
];

export interface TreatmentRequiredValuesByDentitionType {
  primaryTeeth: boolean;
  secondaryTeeth: boolean;
}

export function calculateTreatmentRequiredValuesByDentitionType(
  dentition: Dentition,
): TreatmentRequiredValuesByDentitionType {
  return {
    primaryTeeth: calculateTreatmentRequired(dentition, "PRIMARY_TOOTH"),
    secondaryTeeth: calculateTreatmentRequired(dentition, "SECONDARY_TOOTH"),
  };
}

export function calculateTreatmentRequired(
  dentition: Dentition,
  type: ToothType,
): boolean {
  const teeth = QUADRANT_NUMBERS.flatMap(
    (quadrant) => dentition[quadrant].teeth,
  );
  return calculateTreatmentRequiredValueForTeeth(teeth, type);
}

function calculateTreatmentRequiredValueForTeeth(
  teeth: Tooth[],
  type: ToothType,
) {
  for (const tooth of teeth) {
    if (hasTreatmentRequiredResult(tooth, type)) {
      return true;
    }
  }
  return false;
}

function hasTreatmentRequiredResult(
  tooth: ToothWithDiagnosis | AddableTooth,
  type: "PRIMARY_TOOTH" | "SECONDARY_TOOTH",
) {
  return (
    tooth.type === "ToothWithDiagnosis" &&
    tooth.toothType === type &&
    hasResultIn(tooth, TREATMENT_REQUIRED_VALUES)
  );
}

function hasResultIn(tooth: ToothWithDiagnosis, result: string[]) {
  return (
    result.includes(tooth.mainResult.value) ||
    result.includes(tooth.secondaryResult.value)
  );
}
