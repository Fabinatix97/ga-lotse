/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChooseTemplateStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseTemplateStep/chooseTemplateStepFormModel";

export function validateChooseTemplateStep(model: ChooseTemplateStepFormModel) {
  if (!model.template) {
    return {
      template: "Bitte Vorlage auswählen.",
    };
  }
  return undefined;
}
