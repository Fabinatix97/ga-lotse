/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChooseEvaluationTemplateOrConfigureDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/createEvaluationFromScratchFormModel";
import { validateEndAfterStart } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";

export function validateConfigureDataSourceStep(
  model: ChooseEvaluationTemplateOrConfigureDataSourceStepFormModel,
) {
  const result = validateEndAfterStart({
    start: model.timeSpan!.start,
    end: model.timeSpan!.end,
    wholeDay: true,
  });
  if (result) {
    return {
      timeSpan: result,
    };
  }
  return undefined;
}
