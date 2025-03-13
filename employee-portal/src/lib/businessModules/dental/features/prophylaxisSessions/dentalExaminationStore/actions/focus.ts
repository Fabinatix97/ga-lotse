/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  DentalExaminationView,
  ElementContext,
  Quadrant,
  Tooth,
  ToothElement,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import {
  firstToothWithDiagnosisIndex,
  lastToothWithDiagnosisIndex,
  resolveToothType,
} from "./utils";

type FocusOutputState = Pick<DentalExaminationState, "currentFocus">;

export const DEFAULT_FOCUS_ELEMENT = "mainResultField" satisfies ToothElement;

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
  const toothType = resolveToothType(toothIndex, teeth);

  return {
    toothContext: {
      quadrantNumber,
      toothIndex,
    },
    element: initElement(view, toothType),
  };
}

export function initElement(
  view: DentalExaminationView,
  toothType: Tooth["type"],
): ToothElement {
  if (toothType === "AddableTooth" || view === "FULL_DENTITION") {
    return "toothButton";
  }

  return DEFAULT_FOCUS_ELEMENT;
}
