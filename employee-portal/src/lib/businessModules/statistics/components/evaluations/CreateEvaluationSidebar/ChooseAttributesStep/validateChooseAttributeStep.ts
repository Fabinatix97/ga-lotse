/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";

import { ChooseAttributesStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/chooseAttributesStepFormModel";

export function validateChooseAttributeStep(
  model: ChooseAttributesStepFormModel & { _selectedAttributeKeys: string[] },
):
  | FormikErrors<{
      selectedAttributes: string;
    }>
  | undefined {
  if ((model._selectedAttributeKeys.length ?? 0) === 0) {
    return {
      selectedAttributes: "Bitte Attribut wählen.",
    };
  }
  return undefined;
}
