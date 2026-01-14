/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationState } from "../examinationStore";
import { DmftValues } from "../types";

interface CalculatedDmftValues {
  primaryTeeth: number;
  secondaryTeeth: number;
}

export function selectDmftValues(
  state: Pick<ExaminationState, "dmftValues">,
): CalculatedDmftValues {
  return {
    primaryTeeth: sumDmftValues(state.dmftValues.primaryTeeth),
    secondaryTeeth: sumDmftValues(state.dmftValues.secondaryTeeth),
  };
}

function sumDmftValues(dmftValues: DmftValues): number {
  return dmftValues.decayed + dmftValues.filled + dmftValues.missing;
}
