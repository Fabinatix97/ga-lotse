/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMainResult, ApiSecondaryResult } from "@eshg/dental-api";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { isEmpty } from "remeda";

import {
  DirtyState,
  DmftValuesState,
  ExaminationState,
  HasResultState,
  PreviousDiagnosesState,
} from "@/stores/examination/examinationStore";
import {
  createAddableTooth,
  createToothResult,
} from "@/stores/examination/factories";
import {
  Dentition,
  Tooth,
  ToothContext,
  ToothResult,
  ToothWithDiagnosis,
} from "@/stores/examination/types";

import { calculateDmftValuesByDentitionType } from "./dmftValues";
import { NavigateFromOutputState, navigateFrom } from "./navigateFrom";
import { toggleToothType } from "./tooth";

type SetResultState = Pick<ExaminationState, "dentition">;
type SetMainResultState = SetResultState & NavigateFromOutputState;

export function setMainResult(
  toothContext: ToothContext,
  newValue: string,
  state: SetMainResultState & PreviousDiagnosesState,
): SetMainResultState & DmftValuesState & DirtyState & HasResultState {
  const { dentition, currentView, currentFocus, previousToothDiagnoses } =
    state;
  const tooth = getToothFromToothContext(dentition, toothContext);

  if (
    !tooth.isRemovable &&
    ((newValue === "M" && tooth.toothType === "SECONDARY_TOOTH") ||
      (newValue === "B" && tooth.toothType === "PRIMARY_TOOTH"))
  ) {
    return {
      ...toggleToothType(toothContext, dentition, previousToothDiagnoses),
      currentView,
      hasResult: hasAnyResult(dentition),
    };
  }

  const isInvalid = isEmptyString(newValue)
    ? !isEmptyString(tooth.secondaryResult1.value) ||
      !isEmptyString(tooth.secondaryResult2.value)
    : !isValidMainResult(newValue);

  const navigateDirection = currentView === "UPPER_JAW" ? "RIGHT" : "LEFT";
  const newDentition = updateToothWithDiagnosis(toothContext, dentition, {
    mainResult: createToothResult(newValue, isInvalid),
  });

  return {
    ...(isInvalid
      ? { currentView, currentFocus }
      : navigateFrom(navigateDirection, state)),
    dentition: newDentition,
    dmftValues: calculateDmftValuesByDentitionType(newDentition),
    dirty: true,
    hasResult: hasAnyResult(newDentition),
  };
}

export function setSecondaryResult1(
  toothContext: ToothContext,
  newValue: string,
  state: SetResultState,
): SetResultState & DirtyState & HasResultState {
  const { dentition } = state;
  const tooth = getToothFromToothContext(dentition, toothContext);

  const isInvalid =
    !isEmptyString(newValue) && !isValidSecondaryResult(newValue);

  const mainResult = setMainResultInvalidIfEmpty(
    tooth.mainResult,
    tooth.secondaryResult2,
    newValue,
  );

  const newDentition = updateToothWithDiagnosis(toothContext, dentition, {
    mainResult,
    secondaryResult1: createToothResult(newValue, isInvalid),
  });

  return {
    dentition: newDentition,
    dirty: true,
    hasResult: hasAnyResult(newDentition),
  };
}

export function setSecondaryResult2(
  toothContext: ToothContext,
  newValue: string,
  state: SetResultState,
): SetResultState & DirtyState & HasResultState {
  const { dentition } = state;
  const tooth = getToothFromToothContext(dentition, toothContext);

  const isInvalid =
    !isEmptyString(newValue) && !isValidSecondaryResult(newValue);

  const mainResult = setMainResultInvalidIfEmpty(
    tooth.mainResult,
    tooth.secondaryResult1,
    newValue,
  );

  const newDentition = updateToothWithDiagnosis(toothContext, dentition, {
    mainResult,
    secondaryResult2: createToothResult(newValue, isInvalid),
  });

  return {
    dentition: newDentition,
    dirty: true,
    hasResult: hasAnyResult(newDentition),
  };
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

function isEmptyToothResult(toothResult: ToothResult): boolean {
  return toothResult.value === "";
}

export function isValidSecondaryResult(
  newValue: string,
): newValue is ApiSecondaryResult {
  return Object.values(ApiSecondaryResult).includes(
    newValue as ApiSecondaryResult,
  );
}

export function isValidMainResult(newValue: string): newValue is ApiMainResult {
  return Object.values(ApiMainResult).includes(newValue as ApiMainResult);
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

  let updatedTooth: Tooth;
  if (tooth.isRemovable && newTooth.mainResult?.value === "U") {
    updatedTooth = createAddableTooth(tooth.toothNumber);
  } else {
    updatedTooth = { ...tooth, ...newTooth };
  }

  return {
    ...dentition,
    [quadrantNumber]: {
      ...targetQuadrant,
      teeth: targetQuadrant.teeth.with(toothIndex, updatedTooth),
    },
  };
}

export function hasAnyResult(dentition: Dentition): boolean {
  return Object.values(dentition)
    .flatMap((quadrant) => quadrant.teeth)
    .some(
      (tooth) =>
        tooth.type === "ToothWithDiagnosis" &&
        !(
          isEmpty(tooth.mainResult.value) &&
          isEmpty(tooth.secondaryResult1.value) &&
          isEmpty(tooth.secondaryResult2.value)
        ),
    );
}
