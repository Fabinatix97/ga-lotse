/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { ApiTooth } from "@eshg/dental-api";

import { ALL_TEETH, OPTIONAL_TEETH, RELATED_TEETH } from "../../config/teeth";

import {
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
  ToothDiagnoses,
} from "./ExaminationResult";

export type ExaminationStatus = "OPEN" | "CLOSED" | "NOT_PRESENT";

interface ExaminationProperties {
  isScreening: boolean;
  isFluoridation: boolean;
  isFluoridationConsentGiven?: boolean;
}

export function mapToExaminationStatus(
  examinationResult: ExaminationResult | undefined,
  {
    isScreening,
    isFluoridation,
    isFluoridationConsentGiven,
  }: ExaminationProperties,
): ExaminationStatus {
  const isNeitherScreeningNorFluoridation = !isScreening && !isFluoridation;
  const isUnfeasibleFluoridationOnly =
    !isScreening && isFluoridation && !isFluoridationConsentGiven;
  const isUnfeasibleExamination =
    isNeitherScreeningNorFluoridation || isUnfeasibleFluoridationOnly;

  if (examinationResult === undefined) {
    return isUnfeasibleExamination ? "CLOSED" : "OPEN";
  }
  if (examinationResult.type === "absence") {
    return "NOT_PRESENT";
  }
  return requiredFieldsDefined(examinationResult, isUnfeasibleFluoridationOnly)
    ? "CLOSED"
    : "OPEN";
}

function requiredFieldsDefined(
  examinationResult: ScreeningExaminationResult | FluoridationExaminationResult,
  isUnfeasibleFluoridation: boolean,
) {
  const isFluoridationApplied = isDefined(
    examinationResult.fluorideVarnishApplied,
  );
  const isFluoridationComplete =
    isUnfeasibleFluoridation || isFluoridationApplied;

  switch (examinationResult.type) {
    case "screening":
      return (
        isFluoridationComplete && allRequiredDiagnosesSet(examinationResult)
      );
    case "fluoridation":
      return isFluoridationComplete;
    default:
      return false;
  }
}

function allRequiredDiagnosesSet(result: ScreeningExaminationResult) {
  const diagnoses = result.toothDiagnoses;

  return ALL_TEETH.values().every((secondaryTooth) => {
    const primaryTooth = RELATED_TEETH[secondaryTooth];
    const isOptionalTooth = OPTIONAL_TEETH.has(secondaryTooth);
    const toothRemoved = !isDefined(diagnoses[secondaryTooth]);
    return isOptionalTooth
      ? mainResultDefined(diagnoses, secondaryTooth) || toothRemoved
      : mainResultDefined(diagnoses, secondaryTooth) ||
          mainResultDefined(diagnoses, primaryTooth);
  });
}

function mainResultDefined(
  diagnoses: ToothDiagnoses,
  tooth: ApiTooth | undefined,
) {
  return isDefined(tooth) && isDefined(diagnoses[tooth]?.mainResult);
}
