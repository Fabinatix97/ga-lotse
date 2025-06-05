/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMainResult } from "@eshg/dental-api";

import { QUADRANT_NUMBERS, WISDOM_TEETH } from "../constants";
import { DmftValuesByDentitionType } from "../examinationStore";
import {
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

const D_VALUES: string[] = [ApiMainResult.D, ApiMainResult.E, ApiMainResult.W];
const M_VALUES: string[] = [ApiMainResult.M];
const F_VALUES: string[] = [ApiMainResult.F, ApiMainResult.K];

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
  return teeth.reduce((acc: DmftValues, curr) => {
    if (
      curr.type !== "ToothWithDiagnosis" ||
      curr.toothType !== type ||
      WISDOM_TEETH.has(curr.toothNumber)
    ) {
      return acc;
    }
    if (hasResultIn(M_VALUES, curr)) {
      return { ...acc, missing: acc.missing + 1 };
    } else if (hasResultIn(D_VALUES, curr)) {
      return { ...acc, decayed: acc.decayed + 1 };
    } else if (hasResultIn(F_VALUES, curr)) {
      return { ...acc, filled: acc.filled + 1 };
    } else return acc;
  }, EMPTY_DMFT_VALUES);
}

function hasResultIn(result: string[], tooth: ToothWithDiagnosis) {
  return (
    result.includes(tooth.mainResult.value) ||
    result.includes(tooth.secondaryResult.value)
  );
}
