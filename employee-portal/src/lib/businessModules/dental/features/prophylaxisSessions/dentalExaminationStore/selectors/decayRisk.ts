/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";

import { selectDmftValues } from "./dmftValues";

export function selectDecayRiskValue(
  participantAge: number,
): (state: Pick<DentalExaminationState, "dmftValues">) => boolean | undefined {
  return function (state) {
    const primaryTeethDmftValue = selectDmftValues(state).primaryTeeth;
    const secondaryTeethDmftValue = selectDmftValues(state).secondaryTeeth;
    const secondaryTeethDecayValue = state.dmftValues.secondaryTeeth.decayed;
    switch (participantAge) {
      case 0:
      case 1:
      case 2:
      case 3:
        return primaryTeethDmftValue > 0;
      case 4:
        return primaryTeethDmftValue > 2;
      case 5:
        return primaryTeethDmftValue > 4;
      case 6:
      case 7:
        return (
          primaryTeethDmftValue + secondaryTeethDmftValue > 5 ||
          secondaryTeethDecayValue > 0
        );
      case 8:
      case 9:
        return (
          primaryTeethDmftValue + secondaryTeethDmftValue > 5 ||
          secondaryTeethDecayValue > 2
        );
      default:
        return undefined;
    }
  };
}
