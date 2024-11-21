/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UpdateStatisticDataBasisFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateStatisticDataBasisSidebar/updateStatisticDataBasisFormModel";
import { validateEndAfterStart } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";

export function validateUpdateStatisticDataBasisStep(
  model: UpdateStatisticDataBasisFormModel,
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
