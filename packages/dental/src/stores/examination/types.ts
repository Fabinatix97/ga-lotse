/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMainResult, ApiSecondaryResult, ApiTooth } from "@eshg/dental-api";

export type ExaminationView = "UPPER_JAW" | "LOWER_JAW" | "FULL_DENTITION";

export function isExaminationView(
  value: number | string | null | undefined,
): value is ExaminationView {
  return ["UPPER_JAW", "LOWER_JAW", "FULL_DENTITION"].includes(
    value as ExaminationView,
  );
}

export type Dentition = Record<QuadrantNumber, Quadrant>;

export interface Quadrant {
  quadrantNumber: QuadrantNumber;
  teeth: Tooth[];
}

export type QuadrantNumber = "Q1" | "Q2" | "Q3" | "Q4";

export type Tooth = ToothWithDiagnosis | AddableTooth;

export interface ToothWithDiagnosis {
  type: "ToothWithDiagnosis";
  toothNumber: ApiTooth;
  toothType: ToothType;
  isRemovable: boolean;
  mainResult: ToothResult;
  secondaryResult1: ToothResult;
  secondaryResult2: ToothResult;
  previousResults: ToothDiagnosisResult[];
}

export interface AddableTooth {
  type: "AddableTooth";
  toothNumber: ApiTooth;
}

export function isToothWithDiagnosis(
  tooth: Tooth,
): tooth is ToothWithDiagnosis {
  return tooth.type === "ToothWithDiagnosis";
}

export function isAddableTooth(tooth: Tooth): tooth is AddableTooth {
  return tooth.type === "AddableTooth";
}

export function isInUpperJaw(tooth: Tooth) {
  const quadrantIdentifier = parseInt(tooth.toothNumber.substring(1, 2));
  return (
    quadrantIdentifier === 1 ||
    quadrantIdentifier === 2 ||
    quadrantIdentifier === 5 ||
    quadrantIdentifier === 6
  );
}

export type ToothType = "PRIMARY_TOOTH" | "SECONDARY_TOOTH";

export type ToothDiagnosisResult = ApiMainResult | ApiSecondaryResult;

export interface ToothResult {
  value: string;
  isInvalid: boolean;
}

export interface ToothContext {
  quadrantNumber: QuadrantNumber;
  toothIndex: number;
}

export type ToothElement = "toothButton" | ToothFieldElement;

export type ToothFieldElement =
  | "mainResultField"
  | "secondaryResult1Field"
  | "secondaryResult2Field";

export interface ElementContext {
  toothContext: ToothContext;
  element: ToothElement;
}

export function hasPreviousExaminationResult(
  tooth: ToothWithDiagnosis,
): boolean {
  return (
    tooth.previousResults.length > 0 &&
    tooth.previousResults[0] !== ApiMainResult.S
  );
}

export interface DmftValues {
  decayed: number;
  missing: number;
  filled: number;
}
