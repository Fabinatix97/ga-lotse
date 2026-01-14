/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";
import { isDefined } from "remeda";

import { AffectedPersonFormInputs, ReportMeaslesCase } from "./types";

export function validateReportCaseForm(
  values: ReportMeaslesCase,
): FormikErrors<ReportMeaslesCase> {
  const errors: FormikErrors<ReportMeaslesCase> = {
    affectedPersons: [],
  };

  const affectedPersonErrors: FormikErrors<string>[] = [];
  values.affectedPersons.forEach((affectedPerson, i) => {
    Object.keys(affectedPerson).forEach((key) => {
      if (!isDefined(affectedPerson[key as keyof AffectedPersonFormInputs])) {
        affectedPersonErrors.push(
          `Missing ${key} for affected person ${i + 1}`,
        );
      }
    });
  });

  if (affectedPersonErrors) errors.affectedPersons = affectedPersonErrors;

  return errors;
}
