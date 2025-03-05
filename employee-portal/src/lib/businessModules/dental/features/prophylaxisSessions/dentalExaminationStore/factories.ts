/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTooth } from "@eshg/dental-api";
import { ToothDiagnoses } from "@eshg/dental/api/models/ExaminationResult";
import { ToothDiagnosis } from "@eshg/dental/api/models/ToothDiagnosis";
import { RELATED_TEETH } from "@eshg/dental/config/teeth";
import { isDefined } from "remeda";

import { OPTIONAL_TEETH, TOOTH_TYPES } from "./constants";
import {
  AddableTooth,
  Dentition,
  Quadrant,
  QuadrantNumber,
  Tooth,
  ToothDiagnosisResult,
  ToothResult,
  ToothWithDiagnosis,
} from "./types";

export function createPrimaryDentition(
  toothDiagnoses: ToothDiagnoses = {},
  previousToothDiagnoses: ToothDiagnoses = {},
): Dentition {
  return createDentition(
    ["T18", "T17", "T16", "T55", "T54", "T53", "T52", "T51"],
    ["T61", "T62", "T63", "T64", "T65", "T26", "T27", "T28"],
    ["T71", "T72", "T73", "T74", "T75", "T36", "T37", "T38"],
    ["T48", "T47", "T46", "T85", "T84", "T83", "T82", "T81"],
    toothDiagnoses,
    previousToothDiagnoses,
    true,
  );
}

export function createSecondaryDentition(
  toothDiagnoses: ToothDiagnoses = {},
  previousToothDiagnoses: ToothDiagnoses = {},
): Dentition {
  return createDentition(
    ["T18", "T17", "T16", "T15", "T14", "T13", "T12", "T11"],
    ["T21", "T22", "T23", "T24", "T25", "T26", "T27", "T28"],
    ["T31", "T32", "T33", "T34", "T35", "T36", "T37", "T38"],
    ["T48", "T47", "T46", "T45", "T44", "T43", "T42", "T41"],
    toothDiagnoses,
    previousToothDiagnoses,
    false,
  );
}

function createDentition(
  teethQuadrant1: ApiTooth[],
  teethQuadrant2: ApiTooth[],
  teethQuadrant3: ApiTooth[],
  teethQuadrant4: ApiTooth[],
  toothDiagnoses: ToothDiagnoses = {},
  previousToothDiagnoses: ToothDiagnoses = {},
  isPrimaryDentition: boolean,
): Dentition {
  function createToothWithType(
    tooth: ApiTooth,
  ): ToothWithDiagnosis | AddableTooth {
    return OPTIONAL_TEETH.has(tooth) &&
      resolveToothDiagnosis(tooth, toothDiagnoses) === undefined &&
      isPrimaryDentition
      ? createAddableTooth(tooth)
      : createToothWithDiagnosis(tooth, toothDiagnoses, previousToothDiagnoses);
  }

  function processQuadrant(teeth: ApiTooth[]) {
    return teeth.map(createToothWithType);
  }

  return {
    Q1: createQuadrant("Q1", processQuadrant(teethQuadrant1)),
    Q2: createQuadrant("Q2", processQuadrant(teethQuadrant2)),
    Q3: createQuadrant("Q3", processQuadrant(teethQuadrant3)),
    Q4: createQuadrant("Q4", processQuadrant(teethQuadrant4)),
  };
}

function createQuadrant(
  quadrantNumber: QuadrantNumber,
  teeth: Tooth[],
): Quadrant {
  return {
    quadrantNumber,
    teeth,
  };
}

export function createToothWithDiagnosis(
  tooth: ApiTooth,
  toothDiagnoses: ToothDiagnoses = {},
  previousToothDiagnoses: ToothDiagnoses = {},
): ToothWithDiagnosis {
  const diagnosis = resolveToothDiagnosis(tooth, toothDiagnoses);
  const previousDiagnosis = resolvePreviousToothDiagnosis(
    tooth,
    previousToothDiagnoses,
  );
  const toothNumber = diagnosis?.tooth ?? tooth;

  return {
    type: "ToothWithDiagnosis",
    toothNumber,
    toothType: TOOTH_TYPES[toothNumber],
    isRemovable: OPTIONAL_TEETH.has(toothNumber),
    mainResult: createToothResult(diagnosis?.mainResult),
    secondaryResult1: createToothResult(diagnosis?.secondaryResult1),
    secondaryResult2: createToothResult(diagnosis?.secondaryResult2),
    previousResults: previousDiagnosis,
  };
}

function resolveToothDiagnosis(
  toothNumber: ApiTooth,
  toothDiagnoses: ToothDiagnoses,
): ToothDiagnosis | undefined {
  if (isDefined(toothDiagnoses[toothNumber])) {
    return toothDiagnoses[toothNumber];
  }

  const relatedTooth = RELATED_TEETH[toothNumber];
  if (relatedTooth === undefined) {
    return undefined;
  }

  return toothDiagnoses[relatedTooth];
}

function resolvePreviousToothDiagnosis(
  toothNumber: ApiTooth,
  toothDiagnoses: ToothDiagnoses,
): ToothDiagnosisResult[] {
  let result = resolveToothDiagnosisResult(toothNumber, toothDiagnoses);

  if (result.length === 0) {
    const relatedTooth = RELATED_TEETH[toothNumber];
    if (isDefined(relatedTooth)) {
      result = resolveToothDiagnosisResult(relatedTooth, toothDiagnoses);
    }
  }
  return result;
}

function resolveToothDiagnosisResult(
  toothNumber: ApiTooth,
  toothDiagnoses: ToothDiagnoses,
): ToothDiagnosisResult[] {
  const toothDiagnosis = toothDiagnoses[toothNumber];
  if (isDefined(toothDiagnosis)) {
    return [
      toothDiagnosis.mainResult,
      toothDiagnosis.secondaryResult1,
      toothDiagnosis.secondaryResult2,
    ].filter(isDefined);
  }
  return [];
}

export function createToothResult(value = "", isInvalid = false): ToothResult {
  return {
    value,
    isInvalid,
  };
}

export function createAddableTooth(tooth: ApiTooth): AddableTooth {
  return {
    type: "AddableTooth",
    toothNumber: tooth,
  };
}
