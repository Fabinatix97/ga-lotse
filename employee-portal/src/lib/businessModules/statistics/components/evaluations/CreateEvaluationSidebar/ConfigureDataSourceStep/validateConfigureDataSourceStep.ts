/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigureDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ConfigureDataSourceStep/configureDataSourceStepFormModel";
import { validateEndAfterStart } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";

export function validateConfigureDataSourceStep(
  model: ConfigureDataSourceStepFormModel,
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
  return undefined;
}
