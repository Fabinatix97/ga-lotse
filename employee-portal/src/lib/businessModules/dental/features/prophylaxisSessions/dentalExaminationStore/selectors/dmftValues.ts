/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import { DmftValues } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface CalculatedDmftValues {
  primaryTeeth: number;
  secondaryTeeth: number;
}

export function selectDmftValues(
  state: Pick<DentalExaminationState, "dmftValues">,
): CalculatedDmftValues {
  return {
    primaryTeeth: sumDmftValues(state.dmftValues.primaryTeeth),
    secondaryTeeth: sumDmftValues(state.dmftValues.secondaryTeeth),
  };
}

function sumDmftValues(dmftValues: DmftValues): number {
  return dmftValues.decayed + dmftValues.filled + dmftValues.missing;
}
