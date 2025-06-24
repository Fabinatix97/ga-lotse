/**
 * Copyright 2025 cronn GmbH
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
  ToothWithDiagnosis,
  isAddableTooth,
} from "../types";

import { calculateDmftValuesByDentitionType } from "./dmftValues";
import { hasAnyResult } from "./result";

type AddToothInputState = Pick<
  ExaminationState,
  "dentition" | "previousToothDiagnoses"
>;

type AddToothOutputState = Pick<
  ExaminationState,
  "dentition" | "dirty" | "currentFocus"
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

  return {
    currentFocus: {
      toothContext: toothContext,
      element: focusMainResult ? "mainResultField" : "toothButton",
    },
    dentition: {
      ...dentition,
      [quadrantNumber]: {
        ...targetQuadrant,
        teeth: targetQuadrant.teeth.with(toothContext.toothIndex, newTooth),
      },
    },
    dirty: true,
  };
}

type RemoveToothState = Pick<
  ExaminationState,
  "dentition" | "dmftValues" | "dirty" | "hasResult"
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

  const newDentition = {
    ...dentition,
    [quadrantNumber]: {
      ...targetQuadrant,
      teeth: targetQuadrant.teeth.with(toothContext.toothIndex, newTooth),
    },
  };

  return {
    dentition: newDentition,
    dmftValues: calculateDmftValuesByDentitionType(newDentition),
    dirty: true,
    hasResult: hasAnyResult(newDentition),
  };
}

export function toggleToothType(
  toothContext: ToothContext,
  focusMainResult: boolean,
  dentition: Dentition,
  previousToothDiagnoses: ToothDiagnoses,
): Pick<
  ExaminationState,
  "dentition" | "dirty" | "dmftValues" | "currentFocus"
> {
  const { quadrantNumber, toothIndex } = toothContext;
  const targetQuadrant = dentition[quadrantNumber];
  const tooth = targetQuadrant.teeth[toothIndex];

  if (tooth === undefined) {
    throw Error(
      `Tooth with index ${toothIndex} does not exist in quadrant ${quadrantNumber}`,
    );
  }

  if (tooth.type !== "ToothWithDiagnosis") {
    throw new Error("Tooth must be of type ToothWithDiagnosis");
  }

  const relatedTooth = RELATED_TEETH[tooth.toothNumber];

  if (relatedTooth === undefined) {
    throw Error(`${tooth.toothNumber} has no related tooth`);
  }

  const newTooth: ToothWithDiagnosis = {
    ...tooth,
    toothNumber: relatedTooth,
    toothType:
      tooth.toothType === "PRIMARY_TOOTH" ? "SECONDARY_TOOTH" : "PRIMARY_TOOTH",
    previousResults: resolveToothDiagnosisResult(
      relatedTooth,
      previousToothDiagnoses,
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
    dmftValues: calculateDmftValuesByDentitionType(newDentition),
    dirty: true,
  };
}
