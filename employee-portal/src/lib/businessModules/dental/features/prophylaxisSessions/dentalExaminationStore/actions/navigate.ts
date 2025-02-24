/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MAX_TOOTH_INDEX,
  MIN_TOOTH_INDEX,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/constants";
import type { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  DentalExaminationView,
  ElementContext,
  QuadrantNumber,
  ResultField,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

export type NavigateDirection = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type NavigateState = Pick<
  DentalExaminationState,
  "currentView" | "currentFocus"
>;

export function navigate(
  direction: NavigateDirection,
  state: NavigateState,
): NavigateState {
  switch (direction) {
    case "UP":
      return navigateUp(state);
    case "DOWN":
      return navigateDown(state);
    case "LEFT":
      return navigateLeft(state);
    case "RIGHT":
      return navigateRight(state);
  }
}

function navigateUp(state: NavigateState): NavigateState {
  const { currentView, currentFocus } = state;
  const { field, toothContext } = currentFocus;

  if (currentView === "FULL_DENTITION" || field === undefined) {
    return { currentView, currentFocus };
  }

  switch (field) {
    case "main":
      return { currentView, currentFocus };
    case "secondary1":
      return navigateToTooth(currentView, { field: "main", toothContext });
    case "secondary2":
      return navigateToTooth(currentView, {
        field: "secondary1",
        toothContext,
      });
  }
}

function navigateDown(state: NavigateState): NavigateState {
  const { currentView, currentFocus } = state;
  const { field, toothContext } = currentFocus;

  if (currentView === "FULL_DENTITION" || field === undefined) {
    return { currentView, currentFocus };
  }

  switch (field) {
    case "main":
      return navigateToTooth(currentView, {
        field: "secondary1",
        toothContext,
      });
    case "secondary1":
      return navigateToTooth(currentView, {
        field: "secondary2",
        toothContext,
      });
    case "secondary2":
      return { currentView, currentFocus };
  }
}

function navigateLeft(state: NavigateState): NavigateState {
  const { currentView, currentFocus } = state;
  const { quadrantNumber, toothIndex } = currentFocus.toothContext;

  if (toothIndex > MIN_TOOTH_INDEX) {
    return navigateToTooth(currentView, {
      field: defaultField(currentView),
      toothContext: {
        quadrantNumber,
        toothIndex: toothIndex - 1,
      },
    });
  }

  if (quadrantNumber === "Q1" && currentView === "FULL_DENTITION") {
    return navigateToFirstTooth("LOWER_JAW", "Q4");
  }

  if (quadrantNumber === "Q2") {
    return navigateToLastTooth(currentView, "Q1");
  }

  if (quadrantNumber === "Q3") {
    return navigateToLastTooth(currentView, "Q4");
  }

  if (quadrantNumber === "Q4" && currentView !== "FULL_DENTITION") {
    return navigateToFirstTooth("FULL_DENTITION", "Q1");
  }

  return { currentView, currentFocus };
}

function navigateRight(state: NavigateState): NavigateState {
  const { currentView, currentFocus } = state;
  const { quadrantNumber, toothIndex } = currentFocus.toothContext;

  if (toothIndex < MAX_TOOTH_INDEX) {
    return navigateToTooth(currentView, {
      field: defaultField(currentView),
      toothContext: {
        toothIndex: toothIndex + 1,
        quadrantNumber,
      },
    });
  }

  if (quadrantNumber === "Q1") {
    return navigateToFirstTooth(currentView, "Q2");
  }

  if (quadrantNumber === "Q2") {
    return navigateToLastTooth(
      currentView === "FULL_DENTITION" ? "FULL_DENTITION" : "LOWER_JAW",
      "Q3",
    );
  }

  if (quadrantNumber === "Q3") {
    return navigateToLastTooth(
      currentView === "FULL_DENTITION" ? "FULL_DENTITION" : "UPPER_JAW",
      "Q2",
    );
  }

  if (quadrantNumber === "Q4") {
    return navigateToFirstTooth(currentView, "Q3");
  }

  return { currentView, currentFocus };
}

function navigateToTooth(
  view: DentalExaminationView,
  element: ElementContext,
): NavigateState {
  return {
    currentView: view,
    currentFocus: element,
  };
}

function navigateToFirstTooth(
  view: DentalExaminationView,
  quadrantNumber: QuadrantNumber,
): NavigateState {
  return navigateToTooth(view, {
    field: defaultField(view),
    toothContext: {
      quadrantNumber,
      toothIndex: MIN_TOOTH_INDEX,
    },
  });
}

function navigateToLastTooth(
  view: DentalExaminationView,
  quadrantNumber: QuadrantNumber,
): NavigateState {
  return navigateToTooth(view, {
    field: defaultField(view),
    toothContext: {
      quadrantNumber,
      toothIndex: MAX_TOOTH_INDEX,
    },
  });
}

function defaultField(view: DentalExaminationView): ResultField | undefined {
  return view === "FULL_DENTITION" ? undefined : "main";
}
