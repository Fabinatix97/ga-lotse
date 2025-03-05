/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiSecondaryResult } from "@eshg/dental-api";
import { ToothDiagnoses } from "@eshg/dental/api/models/ExaminationResult";
import { RELATED_TEETH } from "@eshg/dental/config/teeth";

import {
  DentalExaminationState,
  calculateDmftValues,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import { createToothWithDiagnosis } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/factories";
import {
  AddableTooth,
  Dentition,
  ElementContext,
  ToothContext,
  ToothResult,
  ToothWithDiagnosis,
  isAddableTooth,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import {
  isEmptyToothResult,
  isValidMainResult,
  isValidSecondaryResult,
} from "./result";

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

type RemoveToothState = Pick<
  DentalExaminationState,
  "dentition" | "dmftValues"
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
    dmftValues: calculateDmftValues(newDentition),
  };
}

export function toggleToothType(
  toothContext: ToothContext,
  dentition: Dentition,
): Dentition {
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
  };

  return {
    ...dentition,
    [quadrantNumber]: {
      ...targetQuadrant,
      teeth: targetQuadrant.teeth.with(toothContext.toothIndex, newTooth),
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

type FocusOutputState = Pick<DentalExaminationState, "currentFocus">;

export function setFocus(newFocus: ElementContext): FocusOutputState {
  return {
    currentFocus: newFocus,
  };
}
