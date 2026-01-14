/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CreateEvaluationStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/templates/CreateEvaluationFromTemplateSidebar/CreateEvaluationStep/createEvaluationStepFormModel";
import { validateEndAfterStart } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";

export function validateCreateEvaluationStep(
  model: CreateEvaluationStepFormModel,
) {
  const result = validateEndAfterStart({
    start: model.timeSpan.start,
    end: model.timeSpan.end,
    wholeDay: true,
  });
  if (result) {
    return {
      timeSpan: result,
    };
  }

  if (model.anonymizationOptions === "NEITHER") {
    return {
      anonymized:
        "Erstellen einer Auswertung auf Basis dieser Vorlage nicht möglich.",
    };
  }
  return undefined;
}
