/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNullish } from "remeda";

import { ChooseAttributesStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/chooseAttributesStepFormModel";

export function validateChooseAttributeStep(
  model: ChooseAttributesStepFormModel,
) {
  if (
    isNullish(model.selectedAttributeKeys) ||
    (model.selectedAttributeKeys?.length ?? 0) === 0
  ) {
    return {
      noAttribute: "Bitte Attribut wählen.",
    };
  }
  return undefined;
}
