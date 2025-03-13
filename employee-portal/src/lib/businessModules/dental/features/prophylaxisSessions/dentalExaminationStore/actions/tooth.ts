/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RELATED_TEETH, ToothDiagnoses, ToothDiagnosis } from "@eshg/dental";
import { ApiMainResult, ApiSecondaryResult, ApiTooth } from "@eshg/dental-api";

import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  createToothWithDiagnosis,
  resolveToothDiagnosisResult,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/factories";
import {
  AddableTooth,
  Dentition,
  ToothContext,
  ToothResult,
  ToothWithDiagnosis,
  isAddableTooth,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import { calculateDmftValuesByDentitionType } from "./dmftValues";
import {
  hasAnyResult,
  isValidMainResult,
  isValidSecondaryResult,
} from "./result";

type AddToothState = Pick<DentalExaminationState, "dentition" | "dirty">;

export function addTooth(
  toothContext: ToothContext,
  dentition: Dentition,
): AddToothState {
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
  DentalExaminationState,
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
  dentition: Dentition,
  previousToothDiagnoses: Partial<Record<ApiTooth, ToothDiagnosis>>,
): Pick<DentalExaminationState, "dentition" | "dirty" | "dmftValues"> {
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
    dentition: newDentition,
    dmftValues: calculateDmftValuesByDentitionType(newDentition),
    dirty: true,
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

      toothDiagnoses[toothNumber] = {
        tooth: toothNumber,
        mainResult: resolveMainResult(mainResult),
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

function resolveMainResult(
  toothResult: ToothResult,
): ApiMainResult | undefined {
  assertIsValid(toothResult);

  if (!isValidMainResult(toothResult.value)) {
    return undefined;
  }

  return toothResult.value;
}

function assertIsValid(toothResult: ToothResult): void {
  if (toothResult.isInvalid) {
    throw new Error("Invalid tooth result");
  }
}
