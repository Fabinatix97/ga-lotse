/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { initElement } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/actions/focus";
import { JAW_VIEW_BY_QUADRANT } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/constants";
import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  ToothContext,
  ToothElement,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import { resolveTooth } from "./utils";

export type NavigateToInputState = Pick<DentalExaminationState, "dentition">;

type NavigateToOutputState = Pick<
  DentalExaminationState,
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
