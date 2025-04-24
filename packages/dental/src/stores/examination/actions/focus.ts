/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationState } from "@/stores/examination/examinationStore";
import {
  ElementContext,
  ExaminationView,
  Tooth,
  ToothElement,
} from "@/stores/examination/types";

type FocusOutputState = Pick<ExaminationState, "currentFocus">;

export const DEFAULT_FOCUS_ELEMENT = "mainResultField" satisfies ToothElement;

export function setFocus(
  newFocus: ElementContext | undefined,
): FocusOutputState {
  return {
    currentFocus: newFocus,
  };
}

export function initElement(
  view: ExaminationView,
  toothType: Tooth["type"],
): ToothElement {
  if (toothType === "AddableTooth" || view === "FULL_DENTITION") {
    return "toothButton";
  }

  return DEFAULT_FOCUS_ELEMENT;
}
