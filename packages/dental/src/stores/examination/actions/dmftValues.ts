/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMainResult } from "@eshg/dental-api";

import { QUADRANT_NUMBERS, WISDOM_TEETH } from "../constants";
import { DmftValuesByDentitionType } from "../examinationStore";
import {
  AddableTooth,
  Dentition,
  DmftValues,
  Tooth,
  ToothType,
  ToothWithDiagnosis,
} from "../types";

export function calculateDmftValuesByDentitionType(
  dentition: Dentition,
): DmftValuesByDentitionType {
  return {
    primaryTeeth: calculateDmftValues(dentition, "PRIMARY_TOOTH"),
    secondaryTeeth: calculateDmftValues(dentition, "SECONDARY_TOOTH"),
  };
}

const EMPTY_DMFT_VALUES: DmftValues = {
  decayed: 0,
  missing: 0,
  filled: 0,
};

export function calculateDmftValues(
  dentition: Dentition,
  type: ToothType,
): DmftValues {
  const teeth = QUADRANT_NUMBERS.flatMap(
    (quadrant) => dentition[quadrant].teeth,
  );
  return calculateDmftValuesForTeeth(teeth, type);
}

function calculateDmftValuesForTeeth(teeth: Tooth[], type: ToothType) {
  return teeth.reduce(
    (acc: DmftValues, curr) => ({
      decayed: incrementIf(
        acc.decayed,
        hasResultOfType(ApiMainResult.D, curr, type),
      ),
      missing: incrementIf(
        acc.missing,
        hasResultOfType(ApiMainResult.M, curr, type),
      ),
      filled: incrementIf(
        acc.filled,
        hasResultOfType(ApiMainResult.F, curr, type),
      ),
    }),
    EMPTY_DMFT_VALUES,
  );
}

function incrementIf(value: number, predicate: boolean) {
  if (predicate) {
    return value + 1;
  }
  return value;
}

function hasResultOfType(
  result: ApiMainResult,
  tooth: ToothWithDiagnosis | AddableTooth,
  type: "PRIMARY_TOOTH" | "SECONDARY_TOOTH",
) {
  return (
    tooth.type === "ToothWithDiagnosis" &&
    tooth.toothType === type &&
    !WISDOM_TEETH.has(tooth.toothNumber) &&
    tooth.mainResult.value === result
  );
}
