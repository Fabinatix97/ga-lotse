/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  JAW_VIEW_BY_QUADRANT,
  MAX_TOOTH_INDEX,
  MIN_TOOTH_INDEX,
} from "@/stores/examination/constants";
import { ExaminationState } from "@/stores/examination/examinationStore";
import {
  Dentition,
  ElementContext,
  ExaminationView,
  QuadrantNumber,
  ToothContext,
  ToothElement,
} from "@/stores/examination/types";

import { DEFAULT_FOCUS_ELEMENT } from "./focus";
import {
  firstToothWithDiagnosisIndex,
  lastToothWithDiagnosisIndex,
  resolveTooth,
} from "./utils";

interface NavigateContext {
  element: ToothElement;
  dentition: Dentition;
}

export type NavigateDirection = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type NavigateFromInputState = Pick<
  ExaminationState,
  "currentView" | "currentFocus" | "dentition"
>;

export type NavigateFromOutputState = Pick<
  ExaminationState,
  "currentView" | "currentFocus"
>;

export function navigateFrom(
  direction: NavigateDirection,
  state: NavigateFromInputState,
): NavigateFromOutputState {
  const { currentView, currentFocus, dentition } = state;

  if (currentFocus === undefined) {
    return { currentView, currentFocus };
  }

  switch (direction) {
    case "UP":
      return navigateUp(currentView, currentFocus);
    case "DOWN":
      return navigateDown(currentView, currentFocus, dentition);
    case "LEFT":
      return navigateLeft(currentView, currentFocus, dentition);
    case "RIGHT":
      return navigateRight(currentView, currentFocus, dentition);
  }
}

function navigateUp(
  currentView: ExaminationView,
  currentFocus: ElementContext,
): NavigateFromOutputState {
  if (currentView === "FULL_DENTITION") {
    return { currentView, currentFocus };
  }

  const { element, toothContext } = currentFocus;

  switch (element) {
    case "toothButton":
      return { currentView, currentFocus };
    case "mainResultField":
      return navigateToElement(currentView, {
        toothContext,
        element: "toothButton",
      });
    case "secondaryResult1Field":
      return navigateToElement(currentView, {
        toothContext,
        element: "mainResultField",
      });
    case "secondaryResult2Field":
      return navigateToElement(currentView, {
        toothContext,
        element: "secondaryResult1Field",
      });
  }
}

function navigateDown(
  currentView: ExaminationView,
  currentFocus: ElementContext,
  dentition: Dentition,
): NavigateFromOutputState {
  const tooth = resolveTooth(currentFocus.toothContext, dentition);
  if (currentView === "FULL_DENTITION" || tooth.type === "AddableTooth") {
    return { currentView, currentFocus };
  }

  const { element, toothContext } = currentFocus;

  switch (element) {
    case "toothButton":
      return navigateToElement(currentView, {
        toothContext,
        element: "mainResultField",
      });
    case "mainResultField":
      return navigateToElement(currentView, {
        toothContext,
        element: "secondaryResult1Field",
      });
    case "secondaryResult1Field":
      return navigateToElement(currentView, {
        toothContext,
        element: "secondaryResult2Field",
      });
    case "secondaryResult2Field":
      return { currentView, currentFocus };
  }
}

function navigateLeft(
  currentView: ExaminationView,
  currentFocus: ElementContext,
  dentition: Dentition,
): NavigateFromOutputState {
  const { quadrantNumber, toothIndex } = currentFocus.toothContext;

  const minToothWithDiagnosisIndex = firstToothWithDiagnosisIndex(
    dentition[quadrantNumber].teeth,
  );
  const canNavigateToPrevToothWithDiagnosis =
    toothIndex > minToothWithDiagnosisIndex;
  const canNavigateToPrevButton =
    isJawButtonNavigation(currentView, currentFocus) &&
    toothIndex > MIN_TOOTH_INDEX;
  if (canNavigateToPrevToothWithDiagnosis || canNavigateToPrevButton) {
    return navigateToPrevTooth(currentView, currentFocus, dentition);
  }

  const navigateContext: NavigateContext = {
    element: currentFocus.element,
    dentition,
  };

  switch (quadrantNumber) {
    case "Q1":
      return currentView === "FULL_DENTITION"
        ? navigateToFirstTooth(targetQuadrant("Q4"), {
            element: DEFAULT_FOCUS_ELEMENT, // focus default element when returning from FULL_DENTITION
            dentition,
          })
        : { currentView, currentFocus };
    case "Q2":
      return navigateToLastTooth(
        targetQuadrant("Q1", currentView),
        navigateContext,
      );
    case "Q3":
      return navigateToLastTooth(
        targetQuadrant("Q4", currentView),
        navigateContext,
      );
    case "Q4":
      return currentView === "FULL_DENTITION"
        ? { currentView, currentFocus }
        : navigateToFirstTooth(
            targetQuadrant("Q1", "FULL_DENTITION"),
            navigateContext,
          );
  }
}

function navigateRight(
  currentView: ExaminationView,
  currentFocus: ElementContext,
  dentition: Dentition,
): NavigateFromOutputState {
  const { quadrantNumber, toothIndex } = currentFocus.toothContext;

  const maxToothWithDiagnosisIndex = lastToothWithDiagnosisIndex(
    dentition[quadrantNumber].teeth,
  );
  const canNavigateToNextToothWithDiagnosis =
    toothIndex < maxToothWithDiagnosisIndex;
  const canNavigateToNextButton =
    isJawButtonNavigation(currentView, currentFocus) &&
    toothIndex < MAX_TOOTH_INDEX;
  if (canNavigateToNextToothWithDiagnosis || canNavigateToNextButton) {
    return navigateToNextTooth(currentView, currentFocus, dentition);
  }

  const navigateContext: NavigateContext = {
    element: currentFocus.element,
    dentition,
  };

  switch (quadrantNumber) {
    case "Q1":
      return navigateToFirstTooth(
        targetQuadrant("Q2", currentView),
        navigateContext,
      );
    case "Q2":
      return navigateToLastTooth(
        targetQuadrant("Q3", currentView),
        navigateContext,
      );
    case "Q3":
      return navigateToLastTooth(
        targetQuadrant("Q2", currentView),
        navigateContext,
      );
    case "Q4":
      return navigateToFirstTooth(
        targetQuadrant("Q3", currentView),
        navigateContext,
      );
  }
}

function navigateToFirstTooth(
  targetQuadrant: TargetQuadrant,
  navigateContext: NavigateContext,
): NavigateFromOutputState {
  return navigateRecursive(
    MIN_TOOTH_INDEX,
    targetQuadrant,
    navigateContext,
    navigateToNextTooth,
  );
}

function navigateToLastTooth(
  targetQuadrant: TargetQuadrant,
  navigateContext: NavigateContext,
): NavigateFromOutputState {
  return navigateRecursive(
    MAX_TOOTH_INDEX,
    targetQuadrant,
    navigateContext,
    navigateToPrevTooth,
  );
}

function navigateToPrevTooth(
  currentView: ExaminationView,
  currentFocus: ElementContext,
  dentition: Dentition,
): NavigateFromOutputState {
  const { toothContext, element } = currentFocus;
  const { quadrantNumber, toothIndex } = toothContext;

  const navigateContext: NavigateContext = {
    element,
    dentition,
  };
  return navigateRecursive(
    toothIndex - 1,
    targetQuadrant(quadrantNumber, currentView),
    navigateContext,
    navigateLeft,
  );
}

function navigateToNextTooth(
  currentView: ExaminationView,
  currentFocus: ElementContext,
  dentition: Dentition,
): NavigateFromOutputState {
  const { toothContext, element } = currentFocus;
  const { quadrantNumber, toothIndex } = toothContext;

  const navigateContext: NavigateContext = {
    element,
    dentition,
  };
  return navigateRecursive(
    toothIndex + 1,
    targetQuadrant(quadrantNumber, currentView),
    navigateContext,
    navigateRight,
  );
}

function navigateToElement(
  view: ExaminationView,
  element: ElementContext,
): NavigateFromOutputState {
  return {
    currentView: view,
    currentFocus: element,
  };
}

function navigateRecursive(
  startToothIndex: number,
  targetQuadrant: TargetQuadrant,
  navigateContext: NavigateContext,
  navigateNext: (
    currentView: ExaminationView,
    currentFocus: ElementContext,
    dentition: Dentition,
  ) => NavigateFromOutputState,
): NavigateFromOutputState {
  const { view, quadrantNumber } = targetQuadrant;
  const { element, dentition } = navigateContext;

  const toothContext: ToothContext = {
    quadrantNumber,
    toothIndex: startToothIndex,
  };
  const tooth = resolveTooth(toothContext, dentition);

  if (tooth.type === "ToothWithDiagnosis") {
    const isButtonNavigation =
      view === "FULL_DENTITION" || element === "toothButton";
    return navigateToElement(view, {
      toothContext,
      element: isButtonNavigation ? "toothButton" : DEFAULT_FOCUS_ELEMENT,
    });
  }

  // enable navigation on all buttons in jaw views
  if (element === "toothButton" && view !== "FULL_DENTITION") {
    return navigateToElement(view, {
      toothContext,
      element: "toothButton",
    });
  }

  const elementContext: ElementContext = {
    toothContext,
    element,
  };
  return navigateNext(view, elementContext, dentition);
}

interface TargetQuadrant {
  view: ExaminationView;
  quadrantNumber: QuadrantNumber;
}

function targetQuadrant(
  quadrantNumber: QuadrantNumber,
  view?: ExaminationView,
): TargetQuadrant {
  if (view === "FULL_DENTITION") {
    return {
      view,
      quadrantNumber,
    };
  }

  return {
    view: JAW_VIEW_BY_QUADRANT[quadrantNumber],
    quadrantNumber,
  };
}

function isJawButtonNavigation(
  currentView: ExaminationView,
  currentFocus: ElementContext,
): boolean {
  return (
    currentView !== "FULL_DENTITION" && currentFocus.element === "toothButton"
  );
}
