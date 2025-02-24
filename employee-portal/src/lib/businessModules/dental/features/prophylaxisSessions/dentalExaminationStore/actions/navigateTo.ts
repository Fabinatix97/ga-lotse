/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  DentalExaminationView,
  Dentition,
  ElementContext,
  QuadrantNumber,
  ToothContext,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import { resolveTooth } from "./utils";

type NavigateToInputState = Pick<DentalExaminationState, "dentition">;

type NavigateToOutputState = Pick<
  DentalExaminationState,
  "currentView" | "currentFocus"
>;

export function navigateTo(
  toothContext: ToothContext,
  state: NavigateToInputState,
): NavigateToOutputState {
  const targetElement = resolveTargetElement(toothContext, state.dentition);

  return {
    currentView: resolveViewByQuadrant(toothContext.quadrantNumber),
    currentFocus: targetElement,
  };
}

function resolveTargetElement(
  toothContext: ToothContext,
  dentition: Dentition,
): ElementContext {
  const tooth = resolveTooth(toothContext, dentition);

  if (tooth.type === "AddableTooth") {
    return { toothContext };
  }

  return { field: "main", toothContext };
}

function resolveViewByQuadrant(
  quadrantNumber: QuadrantNumber,
): DentalExaminationView {
  return quadrantNumber === "Q1" || quadrantNumber === "Q2"
    ? "UPPER_JAW"
    : "LOWER_JAW";
}
