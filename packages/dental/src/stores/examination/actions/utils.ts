/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Dentition,
  QuadrantNumber,
  Tooth,
  ToothContext,
  isToothWithDiagnosis,
} from "../types";

export function resolveTooth(
  toothContext: ToothContext,
  dentition: Dentition,
): Tooth {
  const { quadrantNumber, toothIndex } = toothContext;
  const tooth = dentition[quadrantNumber].teeth[toothIndex];

  if (tooth === undefined) {
    throw new Error(`Missing tooth ${quadrantNumber}:${toothIndex}`);
  }

  return tooth;
}

export function firstToothWithDiagnosisIndex(teeth: Tooth[]): number {
  return teeth.findIndex(isToothWithDiagnosis);
}

export function lastToothWithDiagnosisIndex(teeth: Tooth[]): number {
  return teeth.findLastIndex(isToothWithDiagnosis);
}

export function isInUpperJaw(quadrantNumber: QuadrantNumber): boolean {
  return quadrantNumber === "Q1" || quadrantNumber === "Q2";
}

export function isInLowerJaw(quadrantNumber: QuadrantNumber): boolean {
  return quadrantNumber === "Q3" || quadrantNumber === "Q4";
}
