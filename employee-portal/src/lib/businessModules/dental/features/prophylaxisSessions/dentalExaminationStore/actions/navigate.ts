/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  DentalExaminationView,
  Dentition,
  ElementContext,
  Quadrant,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import { initField, initFocus } from "./focus";
import {
  firstToothWithDiagnosisIndex,
  lastToothWithDiagnosisIndex,
} from "./utils";

export type NavigateDirection = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type NavigateInputState = Pick<
  DentalExaminationState,
  "currentView" | "currentFocus" | "dentition"
>;

export type NavigateOutputState = Pick<
  DentalExaminationState,
  "currentView" | "currentFocus"
>;

export function navigate(
  direction: NavigateDirection,
  state: NavigateInputState,
): NavigateOutputState {
  const { currentView, currentFocus, dentition } = state;

  if (currentFocus === undefined) {
    return { currentView, currentFocus };
  }
  switch (direction) {
    case "UP":
      return navigateUp(currentView, currentFocus);
    case "DOWN":
      return navigateDown(currentView, currentFocus);
    case "LEFT":
      return navigateLeft(currentView, currentFocus, dentition);
    case "RIGHT":
      return navigateRight(currentView, currentFocus, dentition);
  }
}

function navigateUp(
  currentView: DentalExaminationView,
  currentFocus: ElementContext,
): NavigateOutputState {
  if (currentView === "FULL_DENTITION") {
    return { currentView, currentFocus };
  }

  const { field, toothContext } = currentFocus;

  switch (field) {
    case "main":
    case undefined:
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

function navigateDown(
  currentView: DentalExaminationView,
  currentFocus: ElementContext,
): NavigateOutputState {
  if (currentView === "FULL_DENTITION") {
    return { currentView, currentFocus };
  }

  const { field, toothContext } = currentFocus;

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
    case undefined:
      return { currentView, currentFocus };
  }
}

function navigateLeft(
  currentView: DentalExaminationView,
  currentFocus: ElementContext,
  dentition: Dentition,
): NavigateOutputState {
  const { quadrantNumber, toothIndex } = currentFocus.toothContext;

  const minToothIndex = firstToothWithDiagnosisIndex(
    dentition[quadrantNumber].teeth,
  );
  if (toothIndex > minToothIndex) {
    return navigateToTooth(currentView, {
      field: initField(currentView),
      toothContext: {
        quadrantNumber,
        toothIndex: toothIndex - 1,
      },
    });
  }

  if (quadrantNumber === "Q1" && currentView === "FULL_DENTITION") {
    return navigateToFirstTooth("LOWER_JAW", dentition.Q4);
  }

  if (quadrantNumber === "Q2") {
    return navigateToLastTooth(currentView, dentition.Q1);
  }

  if (quadrantNumber === "Q3") {
    return navigateToLastTooth(currentView, dentition.Q4);
  }

  if (quadrantNumber === "Q4" && currentView !== "FULL_DENTITION") {
    return navigateToFirstTooth("FULL_DENTITION", dentition.Q1);
  }

  return { currentView, currentFocus };
}

function navigateRight(
  currentView: DentalExaminationView,
  currentFocus: ElementContext,
  dentition: Dentition,
): NavigateOutputState {
  const { quadrantNumber, toothIndex } = currentFocus.toothContext;

  const maxToothIndex = lastToothWithDiagnosisIndex(
    dentition[quadrantNumber].teeth,
  );
  if (toothIndex < maxToothIndex) {
    return navigateToTooth(currentView, {
      field: initField(currentView),
      toothContext: {
        toothIndex: toothIndex + 1,
        quadrantNumber,
      },
    });
  }

  if (quadrantNumber === "Q1") {
    return navigateToFirstTooth(currentView, dentition.Q2);
  }

  if (quadrantNumber === "Q2") {
    return navigateToLastTooth(
      currentView === "FULL_DENTITION" ? "FULL_DENTITION" : "LOWER_JAW",
      dentition.Q3,
    );
  }

  if (quadrantNumber === "Q3") {
    return navigateToLastTooth(
      currentView === "FULL_DENTITION" ? "FULL_DENTITION" : "UPPER_JAW",
      dentition.Q2,
    );
  }

  if (quadrantNumber === "Q4") {
    return navigateToFirstTooth(currentView, dentition.Q3);
  }

  return { currentView, currentFocus };
}

function navigateToTooth(
  view: DentalExaminationView,
  element: ElementContext,
): NavigateOutputState {
  return {
    currentView: view,
    currentFocus: element,
  };
}

function navigateToFirstTooth(
  view: DentalExaminationView,
  quadrant: Quadrant,
): NavigateOutputState {
  return navigateToTooth(view, initFocus(view, quadrant, "FIRST_TOOTH"));
}

function navigateToLastTooth(
  view: DentalExaminationView,
  quadrant: Quadrant,
): NavigateOutputState {
  return navigateToTooth(view, initFocus(view, quadrant, "LAST_TOOTH"));
}
