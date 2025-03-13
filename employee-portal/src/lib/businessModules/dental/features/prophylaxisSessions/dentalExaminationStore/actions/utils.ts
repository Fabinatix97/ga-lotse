/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Dentition,
  Tooth,
  ToothContext,
  isToothWithDiagnosis,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

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

export function resolveToothType(
  toothIndex: number,
  teeth: Tooth[],
): Tooth["type"] {
  const tooth = teeth[toothIndex];

  if (tooth === undefined) {
    throw new Error(`Missing tooth ${toothIndex}`);
  }

  return tooth.type;
}

export function firstToothWithDiagnosisIndex(teeth: Tooth[]): number {
  return teeth.findIndex(isToothWithDiagnosis);
}

export function lastToothWithDiagnosisIndex(teeth: Tooth[]): number {
  return teeth.findLastIndex(isToothWithDiagnosis);
}
