/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Dentition,
  Tooth,
  ToothContext,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

export function resolveTooth(
  toothContext: ToothContext,
  dentition: Dentition,
): Tooth {
  const { quadrantNumber, toothIndex } = toothContext;
  const tooth = dentition[quadrantNumber].teeth[toothIndex];

  if (tooth === undefined) {
    throw new Error(`Tooth not found: ${quadrantNumber}:${toothIndex}`);
  }

  return tooth;
}
