/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDecayStatus } from "@eshg/dental-api";

import { DmftValuesState } from "../examinationStore";

import { selectDmftValues } from "./dmftValues";

export function selectDecayStatus(
  state: DmftValuesState,
): ApiDecayStatus | undefined {
  const primaryTeethDecayed = state.dmftValues.primaryTeeth.decayed;
  const primaryTeethFilledOrMissing =
    state.dmftValues.primaryTeeth.filled +
    state.dmftValues.primaryTeeth.missing;
  const secondaryTeethDecayed = state.dmftValues.secondaryTeeth.decayed;
  const secondaryTeethFilledOrMissing =
    state.dmftValues.secondaryTeeth.filled +
    state.dmftValues.secondaryTeeth.missing;

  if (
    selectDmftValues(state).primaryTeeth +
      selectDmftValues(state).secondaryTeeth ===
    0
  ) {
    return ApiDecayStatus.Healthy;
  }

  if (
    primaryTeethDecayed + secondaryTeethDecayed === 0 &&
    primaryTeethFilledOrMissing + secondaryTeethFilledOrMissing > 0
  ) {
    return ApiDecayStatus.Restored;
  }

  if (primaryTeethDecayed + secondaryTeethDecayed > 0) {
    return ApiDecayStatus.TreatmentRequired;
  }
}
