/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  DentalExaminationView,
  ElementContext,
  Tooth,
  ToothElement,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

type FocusOutputState = Pick<DentalExaminationState, "currentFocus">;

export const DEFAULT_FOCUS_ELEMENT = "mainResultField" satisfies ToothElement;

export function setFocus(
  newFocus: ElementContext | undefined,
): FocusOutputState {
  return {
    currentFocus: newFocus,
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
