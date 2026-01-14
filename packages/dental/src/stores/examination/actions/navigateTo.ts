/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationState } from "../examinationStore";
import { ToothContext, ToothElement } from "../types";

import { initElement } from "./focus";
import { resolveTooth } from "./utils";

export type NavigateToInputState = Pick<ExaminationState, "dentition">;

type NavigateToOutputState = Pick<ExaminationState, "currentFocus">;

export function navigateTo(
  toothContext: ToothContext,
  element: ToothElement | "auto",
  state: NavigateToInputState,
): NavigateToOutputState {
  const tooth = resolveTooth(toothContext, state.dentition);
  const targetElement: ToothElement =
    element === "auto" ? initElement(tooth.type) : element;

  return {
    currentFocus: {
      toothContext,
      element: targetElement,
    },
  };
}
