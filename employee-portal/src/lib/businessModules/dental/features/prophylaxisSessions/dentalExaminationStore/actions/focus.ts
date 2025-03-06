/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  DentalExaminationView,
  ElementContext,
  Quadrant,
  ResultField,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import {
  firstToothWithDiagnosisIndex,
  lastToothWithDiagnosisIndex,
} from "./utils";

type FocusOutputState = Pick<DentalExaminationState, "currentFocus">;

export function setFocus(
  newFocus: ElementContext | undefined,
): FocusOutputState {
  return {
    currentFocus: newFocus,
  };
}

type FocusPosition = "FIRST_TOOTH" | "LAST_TOOTH";

export function initFocus(
  view: DentalExaminationView,
  quadrant: Quadrant,
  position: FocusPosition,
): ElementContext {
  const { quadrantNumber, teeth } = quadrant;
  const toothIndex =
    position === "LAST_TOOTH"
      ? lastToothWithDiagnosisIndex(teeth)
      : firstToothWithDiagnosisIndex(teeth);

  return {
    field: initField(view),
    toothContext: {
      quadrantNumber,
      toothIndex,
    },
  };
}

export function initField(
  view: DentalExaminationView,
): ResultField | undefined {
  return view === "FULL_DENTITION" ? undefined : "main";
}
