/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChooseDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/chooseDataSourceStepFormModel";

export function validateChooseDataSourceStep(
  amountEvaluationTemplates: number,
) {
  return (model: ChooseDataSourceStepFormModel) => {
    if (
      amountEvaluationTemplates === 0 &&
      model.dataSourceId === "CHOOSE_EVALUATION_TEMPLATE"
    ) {
      return {
        noTemplates: "Keine Vorlagen vorhanden",
      };
    }
    return undefined;
  };
}
