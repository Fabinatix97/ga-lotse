/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMainResult, ApiSecondaryResult } from "@eshg/dental-api";
import { ToothDiagnoses } from "@eshg/dental/api/models/ExaminationResult";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";

import { createToothResult, createToothWithDiagnosis } from "./factories";
import {
  DentalExaminationView,
  Dentition,
  Focus,
  ToothContext,
  ToothResult,
  ToothWithDiagnosis,
  isAddableTooth,
} from "./types";

export function setMainResult(
  toothContext: ToothContext,
  newValue: string,
  dentition: Dentition,
) {
  const tooth = getToothFromToothContext(dentition, toothContext);

  const isInvalid = isEmptyString(newValue)
    ? !isEmptyString(tooth.secondaryResult1.value) ||
      !isEmptyString(tooth.secondaryResult2.value)
    : !isValidMainResult(newValue);

  return updateToothWithDiagnosis(toothContext, dentition, {
    mainResult: createToothResult(newValue, isInvalid),
  });
}

export function setSecondaryResult1(
  toothContext: ToothContext,
  newValue: string,
  dentition: Dentition,
) {
  const tooth = getToothFromToothContext(dentition, toothContext);

  const isInvalid =
    !isEmptyString(newValue) && !isValidSecondaryResult(newValue);

  const mainResult = setMainResultInvalidIfEmpty(
    tooth.mainResult,
    tooth.secondaryResult2,
    newValue,
  );

  return updateToothWithDiagnosis(toothContext, dentition, {
    mainResult,
    secondaryResult1: createToothResult(newValue, isInvalid),
  });
}

export function setSecondaryResult2(
  toothContext: ToothContext,
  newValue: string,
  dentition: Dentition,
) {
  const tooth = getToothFromToothContext(dentition, toothContext);

  const isInvalid =
    !isEmptyString(newValue) && !isValidSecondaryResult(newValue);

  const mainResult = setMainResultInvalidIfEmpty(
    tooth.mainResult,
    tooth.secondaryResult1,
    newValue,
  );

  return updateToothWithDiagnosis(toothContext, dentition, {
    mainResult,
    secondaryResult2: createToothResult(newValue, isInvalid),
  });
}

function setMainResultInvalidIfEmpty(
  mainResult: ToothResult,
  secondaryResult: ToothResult,
  newValue: string,
) {
  if (isEmptyToothResult(mainResult)) {
    if (isEmptyString(newValue) && isEmptyToothResult(secondaryResult)) {
      return createToothResult(mainResult.value, false);
    } else {
      return createToothResult("", true);
    }
  }
  return mainResult;
}

function getToothFromToothContext(
  dentition: Dentition,
  toothContext: ToothContext,
) {
  return dentition[toothContext.quadrantNumber].teeth[
    toothContext.toothIndex
  ] as ToothWithDiagnosis;
}

function isValidSecondaryResult(
  newValue: string,
): newValue is ApiSecondaryResult {
  return Object.values(ApiSecondaryResult).includes(
    newValue as ApiSecondaryResult,
  );
}

function isValidMainResult(newValue: string): newValue is ApiMainResult {
  return Object.values(ApiMainResult).includes(newValue as ApiMainResult);
}

export function addTooth(
  toothContext: ToothContext,
  dentition: Dentition,
): Dentition {
  const { quadrantNumber, toothIndex } = toothContext;
  const targetQuadrant = dentition[quadrantNumber];
  const tooth = targetQuadrant.teeth[toothIndex];

  if (tooth === undefined) {
    throw new Error(
      `Tooth with index ${toothIndex} does not exist in quadrant ${quadrantNumber}`,
    );
  }

  if (!isAddableTooth(tooth)) {
    throw new Error("Tooth must be of type AddableTooth");
  }

  const newTooth = createToothWithDiagnosis(tooth.toothNumber);

  return {
    ...dentition,
    [quadrantNumber]: {
      ...targetQuadrant,
      teeth: targetQuadrant.teeth.with(toothContext.toothIndex, newTooth),
    },
  };
}

function updateToothWithDiagnosis(
  toothContext: ToothContext,
  dentition: Dentition,
  newTooth: Partial<ToothWithDiagnosis>,
): Dentition {
  const { quadrantNumber, toothIndex } = toothContext;
  const targetQuadrant = dentition[quadrantNumber];
  const tooth = targetQuadrant.teeth[toothIndex];

  if (tooth === undefined) {
    throw new Error(
      `Tooth with index ${toothIndex} does not exist in quadrant ${quadrantNumber}`,
    );
  }

  if (tooth.type !== "ToothWithDiagnosis") {
    throw new Error("Tooth must be of type ToothWithDiagnosis");
  }

  return {
    ...dentition,
    [quadrantNumber]: {
      ...targetQuadrant,
      teeth: targetQuadrant.teeth.with(toothIndex, { ...tooth, ...newTooth }),
    },
  };
}

export function getToothDiagnoses(dentition: Dentition): ToothDiagnoses {
  const toothDiagnoses: ToothDiagnoses = {};

  Object.values(dentition)
    .flatMap((quadrant) => quadrant.teeth)
    .forEach((tooth) => {
      if (tooth.type !== "ToothWithDiagnosis") {
        return;
      }

      const { toothNumber, mainResult, secondaryResult1, secondaryResult2 } =
        tooth;

      assertIsValid(mainResult);

      if (
        isEmptyToothResult(mainResult) ||
        !isValidMainResult(mainResult.value)
      ) {
        return;
      }

      toothDiagnoses[toothNumber] = {
        tooth: toothNumber,
        mainResult: mainResult.value,
        secondaryResult1: resolveSecondaryResult(secondaryResult1),
        secondaryResult2: resolveSecondaryResult(secondaryResult2),
      };
    });

  return toothDiagnoses;
}

function resolveSecondaryResult(
  toothResult: ToothResult,
): ApiSecondaryResult | undefined {
  assertIsValid(toothResult);

  if (!isValidSecondaryResult(toothResult.value)) {
    return undefined;
  }

  return toothResult.value;
}

function assertIsValid(toothResult: ToothResult): void {
  if (toothResult.isInvalid) {
    throw new Error("Invalid tooth result");
  }
}

function isEmptyToothResult(toothResult: ToothResult): boolean {
  return toothResult.value === "";
}

export function setFocus(focus: Focus): {
  focus: Focus;
  currentView: DentalExaminationView;
} {
  const quadrantNumber = focus.toothContext.quadrantNumber;
  const nextView =
    quadrantNumber === "Q1" || quadrantNumber === "Q2"
      ? "UPPER_JAW"
      : "LOWER_JAW";
  return {
    focus,
    currentView: nextView,
  };
}
