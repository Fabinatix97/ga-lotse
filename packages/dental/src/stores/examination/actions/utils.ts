/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Dentition,
  Tooth,
  ToothContext,
  isToothWithDiagnosis,
} from "@/stores/examination/types";

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
