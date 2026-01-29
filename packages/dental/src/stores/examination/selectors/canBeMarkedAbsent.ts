/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmptyArray } from "formik";

import { isEmptyString } from "@eshg/lib-portal";

import { ExaminationStatus } from "../../../api/models/ExaminationStatus";
import {
  EmptinessRules,
  ExaminationFormValues,
} from "../../../types/examination";
import { ExaminationState } from "../examinationStore";
import { QuadrantNumber } from "../types";

export function selectCanBeMarkedAbsent(
  status: ExaminationStatus,
  examinationFormValues: ExaminationFormValues,
): (state: Pick<ExaminationState, "dentition">) => boolean {
  return function (state) {
    if (
      status !== "OPEN" ||
      !additionalInfoFormValuesEmpty(
        examinationFormValues,
        examinationFormValuesEmptinessRules,
      )
    ) {
      return false;
    }
    const quadrants = Object.keys(state.dentition) as QuadrantNumber[];
    return quadrants
      .flatMap((q) => state.dentition[q].teeth)
      .filter((tooth) => tooth.type === "ToothWithDiagnosis")
      .every(
        (tooth) =>
          isEmptyString(tooth.mainResult.value) &&
          isEmptyString(tooth.secondaryResult.value),
      );
  };
}

const examinationFormValuesEmptinessRules: EmptinessRules<ExaminationFormValues> =
  {
    dentitionType: () => true,
    oralHygieneStatus: isEmptyString,
    mihStatus: isEmptyString,
    orthodonticStatus: isEmptyString,
    orthodonticFindings: isEmptyArray,
    fluorideVarnishApplied: (value) => isEmptyString(value) || !value,
    plaque: (value) => !value,
    calculus: (value) => !value,
    gingivitis: (value) => !value,
    parodontitis: (value) => !value,
    blackStain: (value) => !value,
    note: () => true,
    individualProphylaxis: (value) => !value,
    fissureSealing: (value) => !value,
    tartarRemoval: (value) => !value,
    gingivitisTreatment: (value) => !value,
    orthodonticTreatment: (value) => !value,
    plaqueTreatment: (value) => !value,
    primaryDentitionObstructsSecondary: (value) => !value,
    inspectionAppointment: (value) => !value,
  };

function additionalInfoFormValuesEmpty<T extends ExaminationFormValues>(
  additionalInfoFormValues: T,
  emptinessChecks: { [K in keyof T]: (val: T[K]) => boolean },
): boolean {
  const keys = Object.keys(additionalInfoFormValues) as (keyof T)[];
  return keys.every((key) => {
    const isEmpty = emptinessChecks[key];
    const value = additionalInfoFormValues[key];
    return isEmpty(value);
  });
}
