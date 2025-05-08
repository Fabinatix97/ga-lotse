/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MAX_TOOTH_INDEX, MIN_TOOTH_INDEX } from "../constants";
import { ExaminationState } from "../examinationStore";
import {
  Dentition,
  ElementContext,
  QuadrantNumber,
  ToothContext,
  ToothElement,
} from "../types";

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
  "currentFocus" | "dentition"
>;

export type NavigateFromOutputState = Pick<ExaminationState, "currentFocus">;

export function navigateFrom(
  direction: NavigateDirection,
  state: NavigateFromInputState,
): NavigateFromOutputState {
  const { currentFocus, dentition } = state;

  if (currentFocus === undefined) {
    return { currentFocus };
  }

  switch (direction) {
    case "UP":
      return navigateUp(currentFocus);
    case "DOWN":
      return navigateDown(currentFocus, dentition);
    case "LEFT":
      return navigateLeft(currentFocus, dentition);
    case "RIGHT":
      return navigateRight(currentFocus, dentition);
  }
}

function navigateUp(currentFocus: ElementContext): NavigateFromOutputState {
  const { element, toothContext } = currentFocus;

  switch (element) {
    case "toothButton":
      return { currentFocus };
    case "mainResultField":
      return navigateToElement({
        toothContext,
        element: "toothButton",
      });
    case "secondaryResultField":
      return navigateToElement({
        toothContext,
        element: "mainResultField",
      });
  }
}

function navigateDown(
  currentFocus: ElementContext,
  dentition: Dentition,
): NavigateFromOutputState {
  const tooth = resolveTooth(currentFocus.toothContext, dentition);
  if (tooth.type === "AddableTooth") {
    return { currentFocus };
  }

  const { element, toothContext } = currentFocus;

  switch (element) {
    case "toothButton":
      return navigateToElement({
        toothContext,
        element: "mainResultField",
      });
    case "mainResultField":
      return navigateToElement({
        toothContext,
        element: "secondaryResultField",
      });
    case "secondaryResultField":
      return { currentFocus };
  }
}

function navigateLeft(
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
    isToothButton(currentFocus) && toothIndex > MIN_TOOTH_INDEX;
  if (canNavigateToPrevToothWithDiagnosis || canNavigateToPrevButton) {
    return navigateToPrevTooth(currentFocus, dentition);
  }

  const navigateContext: NavigateContext = {
    element: currentFocus.element,
    dentition,
  };

  switch (quadrantNumber) {
    case "Q1":
      return { currentFocus };
    case "Q2":
      return navigateToLastTooth("Q1", navigateContext);
    case "Q3":
      return navigateToLastTooth("Q4", navigateContext);
    case "Q4":
      return { currentFocus };
  }
}

function navigateRight(
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
    isToothButton(currentFocus) && toothIndex < MAX_TOOTH_INDEX;
  if (canNavigateToNextToothWithDiagnosis || canNavigateToNextButton) {
    return navigateToNextTooth(currentFocus, dentition);
  }

  const navigateContext: NavigateContext = {
    element: currentFocus.element,
    dentition,
  };

  switch (quadrantNumber) {
    case "Q1":
      return navigateToFirstTooth("Q2", navigateContext);
    case "Q2":
      return navigateToLastTooth("Q3", navigateContext);
    case "Q3":
      return navigateToLastTooth("Q2", navigateContext);
    case "Q4":
      return navigateToFirstTooth("Q3", navigateContext);
  }
}

function navigateToFirstTooth(
  targetQuadrantNumber: QuadrantNumber,
  navigateContext: NavigateContext,
): NavigateFromOutputState {
  return navigateRecursive(
    MIN_TOOTH_INDEX,
    targetQuadrantNumber,
    navigateContext,
    navigateToNextTooth,
  );
}

function navigateToLastTooth(
  targetQuadrantNumber: QuadrantNumber,
  navigateContext: NavigateContext,
): NavigateFromOutputState {
  return navigateRecursive(
    MAX_TOOTH_INDEX,
    targetQuadrantNumber,
    navigateContext,
    navigateToPrevTooth,
  );
}

function navigateToPrevTooth(
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
    quadrantNumber,
    navigateContext,
    navigateLeft,
  );
}

function navigateToNextTooth(
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
    quadrantNumber,
    navigateContext,
    navigateRight,
  );
}

function navigateToElement(element: ElementContext): NavigateFromOutputState {
  return {
    currentFocus: element,
  };
}

function navigateRecursive(
  startToothIndex: number,
  targetQuadrantNumber: QuadrantNumber,
  navigateContext: NavigateContext,
  navigateNext: (
    currentFocus: ElementContext,
    dentition: Dentition,
  ) => NavigateFromOutputState,
): NavigateFromOutputState {
  const { element, dentition } = navigateContext;

  const toothContext: ToothContext = {
    quadrantNumber: targetQuadrantNumber,
    toothIndex: startToothIndex,
  };
  const tooth = resolveTooth(toothContext, dentition);
  const isButtonNavigation = element === "toothButton";

  if (tooth.type === "ToothWithDiagnosis") {
    return navigateToElement({
      toothContext,
      element: isButtonNavigation ? "toothButton" : DEFAULT_FOCUS_ELEMENT,
    });
  }

  // enable navigation on all buttons
  if (isButtonNavigation) {
    return navigateToElement({
      toothContext,
      element: "toothButton",
    });
  }

  const elementContext: ElementContext = {
    toothContext,
    element,
  };
  return navigateNext(elementContext, dentition);
}

function isToothButton(currentFocus: ElementContext): boolean {
  return currentFocus.element === "toothButton";
}
