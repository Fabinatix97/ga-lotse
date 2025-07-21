/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationState } from "../examinationStore";
import { ElementContext, Tooth, ToothElement } from "../types";

type FocusOutputState = Pick<ExaminationState, "currentFocus">;

const DEFAULT_FOCUS_ELEMENT = "mainResultField" satisfies ToothElement;

export function setFocus(
  newFocus: ElementContext | undefined,
): FocusOutputState {
  return {
    currentFocus: newFocus,
  };
}

export function initElement(toothType: Tooth["type"]): ToothElement {
  if (toothType === "AddableTooth") {
    return "toothButton";
  }

  return DEFAULT_FOCUS_ELEMENT;
}
