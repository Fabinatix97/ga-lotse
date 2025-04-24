/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { JAW_VIEW_BY_QUADRANT } from "@/stores/examination/constants";
import { ExaminationState } from "@/stores/examination/examinationStore";
import { ToothContext, ToothElement } from "@/stores/examination/types";

import { initElement } from "./focus";
import { resolveTooth } from "./utils";

export type NavigateToInputState = Pick<ExaminationState, "dentition">;

type NavigateToOutputState = Pick<
  ExaminationState,
  "currentView" | "currentFocus"
>;

export function navigateTo(
  toothContext: ToothContext,
  element: ToothElement | "auto",
  state: NavigateToInputState,
): NavigateToOutputState {
  const tooth = resolveTooth(toothContext, state.dentition);
  const targetView = JAW_VIEW_BY_QUADRANT[toothContext.quadrantNumber];
  const targetElement: ToothElement =
    element === "auto" ? initElement(targetView, tooth.type) : element;

  return {
    currentView: targetView,
    currentFocus: {
      toothContext,
      element: targetElement,
    },
  };
}
