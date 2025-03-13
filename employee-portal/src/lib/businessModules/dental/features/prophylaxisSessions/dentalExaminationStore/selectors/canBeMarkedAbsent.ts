/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationStatus } from "@eshg/dental";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { isEmptyArray } from "formik";

import { ExaminationFormValues } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { DentalExaminationState } from "@/lib/businessModules/dental/features/prophylaxisSessions//dentalExaminationStore/dentalExaminationStore";
import { QuadrantNumber } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

export function selectCanBeMarkedAbsent(
  status: ExaminationStatus,
  examinationFormValues: ExaminationFormValues,
): (state: Pick<DentalExaminationState, "dentition">) => boolean {
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
          isEmptyString(tooth.secondaryResult1.value) &&
          isEmptyString(tooth.secondaryResult2.value),
      );
  };
}

type EmptinessRules<T> = {
  [K in keyof T]-?: (value: T[K]) => boolean;
};

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
    note: () => true,
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
