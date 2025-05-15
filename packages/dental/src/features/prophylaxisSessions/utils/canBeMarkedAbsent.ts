/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmptyArray } from "formik";

import { isEmptyString } from "@eshg/lib-portal/helpers/guards";

import {
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
} from "../../../api/models/ExaminationResult";
import { ExaminationStatus } from "../../../api/models/ExaminationStatus";
import { EmptinessRules } from "../../../types/examination";

export function canBeMarkedAbsent(
  status: ExaminationStatus,
  result: ExaminationResult | undefined,
): boolean {
  if (result === undefined) {
    return true;
  }
  if (status !== "OPEN") {
    return false;
  }

  switch (result.type) {
    case "screening":
      return screeningExaminationResultEmpty(
        result,
        screeningExaminationResultEmptinessRules,
      );
    case "fluoridation":
      return fluoridationExaminationResultEmpty(
        result,
        fluoridationResultEmptinessRules,
      );
    case "absence":
      return false;
  }
}

const screeningExaminationResultEmptinessRules: EmptinessRules<ScreeningExaminationResult> =
  {
    type: () => true,
    dentitionType: () => true,
    oralHygieneStatus: (value) => value === undefined,
    mihStatus: (value) => value === undefined,
    orthodonticStatus: (value) => value === undefined,
    orthodonticFindings: isEmptyArray,
    fluorideVarnishApplied: (value) => isEmptyString(value) || !value,
    plaque: (value) => !value,
    calculus: (value) => !value,
    gingivitis: (value) => !value,
    parodontitis: (value) => !value,
    toothDiagnoses: (value) =>
      Object.values(value).every(
        (tooth) =>
          tooth.mainResult === undefined && tooth.secondaryResult === undefined,
      ),
    individualProphylaxis: (value) => !value,
    fissureSealing: (value) => !value,
    tartarRemoval: (value) => !value,
    gingivitisTreatment: (value) => !value,
    orthodonticTreatment: (value) => !value,
    plaqueTreatment: (value) => !value,
    inspectionAppointment: (value) => !value,
  };

function screeningExaminationResultEmpty<T extends ScreeningExaminationResult>(
  screeningExaminationResult: T,
  emptinessChecks: { [K in keyof T]: (val: T[K]) => boolean },
): boolean {
  const keys = Object.keys(screeningExaminationResult) as (keyof T)[];
  return keys.every((key) => {
    const isEmpty = emptinessChecks[key];
    const value = screeningExaminationResult[key];
    return isEmpty(value);
  });
}

const fluoridationResultEmptinessRules: EmptinessRules<FluoridationExaminationResult> =
  {
    type: () => true,
    fluorideVarnishApplied: (value) => value === undefined || !value,
  };

function fluoridationExaminationResultEmpty<
  T extends FluoridationExaminationResult,
>(
  fluoridationExaminationResult: T,
  emptinessChecks: { [K in keyof T]: (val: T[K]) => boolean },
): boolean {
  const keys = Object.keys(fluoridationExaminationResult) as (keyof T)[];
  return keys.every((key) => {
    const isEmpty = emptinessChecks[key];
    const value = fluoridationExaminationResult[key];
    return isEmpty(value);
  });
}
