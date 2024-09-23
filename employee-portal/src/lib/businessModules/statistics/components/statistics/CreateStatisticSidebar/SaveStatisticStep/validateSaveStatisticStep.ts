/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SaveStatisticStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/SaveStatisticStep/saveStatisticStepFormModel";
import { validateEndAfterStart } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";

export function validateSaveStatisticStep(model: SaveStatisticStepFormModel) {
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
