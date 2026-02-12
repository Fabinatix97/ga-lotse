/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ToothDiagnoses } from "../../../api/models/ExaminationResult";
import { RELATED_TEETH } from "../../../config/teeth";
import { ExaminationState } from "../examinationStore";
import {
  createToothWithDiagnosis,
  resolveToothDiagnosisResult,
} from "../factories";
import {
  AddableTooth,
  Dentition,
  ToothContext,
  ToothResult,
  ToothType,
  ToothWithDiagnosis,
  isAddableTooth,
} from "../types";

import { calcDentitionType } from "./dentitionType";
import { calculateDmftValuesByDentitionType } from "./dmftValues";
import { hasAnyResult } from "./result";
import { firstToothWithDiagnosis } from "./utils";

type AddToothInputState = Pick<
  ExaminationState,
  "dentition" | "previousToothDiagnoses"
>;

type AddToothOutputState = Pick<
  ExaminationState,
  "dentition" | "dirty" | "currentFocus" | "dentitionType"
>;

export function addTooth(
  toothContext: ToothContext,
  focusMainResult: boolean,
  state: AddToothInputState,
): AddToothOutputState {
  const { dentition, previousToothDiagnoses } = state;
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

  const newTooth = createToothWithDiagnosis(
    tooth.toothNumber,
    {},
    previousToothDiagnoses,
  );
  const updatedTeeth = targetQuadrant.teeth.with(
    toothContext.toothIndex,
    newTooth,
  );

  const newDentition = {
    ...dentition,
    [quadrantNumber]: {
      ...targetQuadrant,
      tabTarget: firstToothWithDiagnosis(updatedTeeth, quadrantNumber),
      teeth: updatedTeeth,
    },
  };

  return {
    currentFocus: {
      toothContext: toothContext,
      element: focusMainResult ? "mainResultField" : "toothButton",
    },
    dentition: newDentition,
    dentitionType: calcDentitionType(newDentition),
    dirty: true,
  };
}

type RemoveToothState = Pick<
  ExaminationState,
  "dentition" | "dmftValues" | "dirty" | "hasResult" | "dentitionType"
>;

export function removeTooth(
  toothContext: ToothContext,
  dentition: Dentition,
): RemoveToothState {
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

  if (!tooth.isRemovable) {
    throw new Error("Tooth is not removable");
  }

  const newTooth: AddableTooth = {
    type: "AddableTooth",
    toothNumber: tooth.toothNumber,
  };
  const updatedTeeth = targetQuadrant.teeth.with(
    toothContext.toothIndex,
    newTooth,
  );

  const newDentition = {
    ...dentition,
    [quadrantNumber]: {
      ...targetQuadrant,
      tabTarget: firstToothWithDiagnosis(updatedTeeth, quadrantNumber),
      teeth: updatedTeeth,
    },
  };

  return {
    dentition: newDentition,
    dentitionType: calcDentitionType(newDentition),
    dmftValues: calculateDmftValuesByDentitionType(newDentition),
    dirty: true,
    hasResult: hasAnyResult(newDentition),
  };
}

function adjustResultForToothType(
  result: ToothResult,
  toothType: ToothType,
): ToothResult {
  return {
    value:
      toothType === "PRIMARY_TOOTH"
        ? result.value.toLowerCase()
        : result.value.toUpperCase(),
    isInvalid: result.isInvalid,
  };
}

export function toggleToothType(
  toothContext: ToothContext,
  focusMainResult: boolean,
  dentition: Dentition,
  previousToothDiagnoses: ToothDiagnoses,
): Pick<
  ExaminationState,
  "dentition" | "dirty" | "dmftValues" | "currentFocus" | "dentitionType"
> {
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

  const relatedTooth = RELATED_TEETH[tooth.toothNumber];

  if (relatedTooth === undefined) {
    throw new Error(`${tooth.toothNumber} has no related tooth`);
  }

  const newToothType =
    tooth.toothType === "PRIMARY_TOOTH" ? "SECONDARY_TOOTH" : "PRIMARY_TOOTH";

  const newTooth: ToothWithDiagnosis = {
    ...tooth,
    toothNumber: relatedTooth,
    toothType: newToothType,
    previousResults: resolveToothDiagnosisResult(
      relatedTooth,
      previousToothDiagnoses,
    ),
    mainResult: adjustResultForToothType(tooth.mainResult, newToothType),
    secondaryResult: adjustResultForToothType(
      tooth.secondaryResult,
      newToothType,
    ),
  };

  const newDentition = {
    ...dentition,
    [quadrantNumber]: {
      ...targetQuadrant,
      teeth: targetQuadrant.teeth.with(toothContext.toothIndex, newTooth),
    },
  };
  return {
    currentFocus: {
      toothContext: toothContext,
      element: focusMainResult ? "mainResultField" : "toothButton",
    },
    dentition: newDentition,
    dentitionType: calcDentitionType(newDentition),
    dmftValues: calculateDmftValuesByDentitionType(newDentition),
    dirty: true,
  };
}
