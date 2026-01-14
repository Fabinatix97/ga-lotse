/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMainResult, ApiSecondaryResult } from "@eshg/dental-api";
import { assertNonEmptyArray } from "@eshg/lib-portal";

import { ToothDiagnoses } from "../../../api/models/ExaminationResult";
import { ExaminationState } from "../examinationStore";
import {
  Dentition,
  ElementContext,
  ToothContext,
  ToothResult,
  ToothWithDiagnosis,
} from "../types";

import { NavigateToInputState, navigateTo } from "./navigateTo";
import { isValidMainResult, isValidSecondaryResult } from "./result";

export type SubmitResult =
  | ValidToothDiagnosesResult
  | InvalidToothDiagnosesResult;

interface ValidToothDiagnosesResult {
  isValid: true;
  toothDiagnoses: ToothDiagnoses;
}

interface InvalidToothDiagnosesResult {
  isValid: false;
  invalidFields: ElementContext[];
}

type SubmitInputState = Pick<ExaminationState, "dentition">;

type SetExaminationStore = (
  setStateFn: (state: ExaminationState) => Partial<ExaminationState>,
) => void;

export function submit(
  state: SubmitInputState,
  set: SetExaminationStore,
): SubmitResult {
  const result = validateDentition(state.dentition);

  set((state) => applySubmissionResult(result, state));

  return result;
}

export function validateDentition(dentition: Dentition): SubmitResult {
  const validToothDiagnoses: ToothDiagnoses = {};
  const allInvalidFields: ElementContext[] = [];

  Object.values(dentition).forEach(({ quadrantNumber, teeth }) => {
    teeth.forEach((tooth, toothIndex) => {
      if (tooth.type !== "ToothWithDiagnosis") {
        return;
      }

      const { toothNumber, mainResult, secondaryResult } = tooth;

      const invalidFields = collectInvalidFields(tooth, {
        quadrantNumber,
        toothIndex,
      });

      if (invalidFields.length > 0) {
        allInvalidFields.push(...invalidFields);
      } else {
        validToothDiagnoses[toothNumber] = {
          tooth: toothNumber,
          mainResult: resolveMainResult(mainResult),
          secondaryResult: resolveSecondaryResult(secondaryResult),
        };
      }
    });
  });

  if (allInvalidFields.length > 0) {
    return {
      isValid: false,
      invalidFields: allInvalidFields,
    };
  }

  return {
    isValid: true,
    toothDiagnoses: validToothDiagnoses,
  };
}

function collectInvalidFields(
  tooth: ToothWithDiagnosis,
  toothContext: ToothContext,
): ElementContext[] {
  const invalidElements: ElementContext[] = [];

  if (tooth.mainResult.isInvalid) {
    invalidElements.push({ element: "mainResultField", toothContext });
  }

  if (tooth.secondaryResult.isInvalid) {
    invalidElements.push({ element: "secondaryResultField", toothContext });
  }

  return invalidElements;
}

function resolveMainResult(
  toothResult: ToothResult,
): ApiMainResult | undefined {
  if (!isValidMainResult(toothResult.value)) {
    return undefined;
  }

  return toothResult.value;
}

function resolveSecondaryResult(
  toothResult: ToothResult,
): ApiSecondaryResult | undefined {
  if (!isValidSecondaryResult(toothResult.value)) {
    return undefined;
  }

  return toothResult.value;
}

type ApplySubmitResultInputState = NavigateToInputState;

export function applySubmissionResult(
  result: SubmitResult,
  state: ApplySubmitResultInputState,
): Partial<ExaminationState> {
  if (result.isValid) {
    return { dirty: false };
  } else {
    assertNonEmptyArray(result.invalidFields);
    const [firstInvalidField] = result.invalidFields;

    return navigateTo(
      firstInvalidField.toothContext,
      firstInvalidField.element,
      state,
    );
  }
}
