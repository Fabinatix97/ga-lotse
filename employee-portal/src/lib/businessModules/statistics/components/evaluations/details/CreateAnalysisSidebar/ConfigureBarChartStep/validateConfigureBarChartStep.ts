/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";

import { DiagramType } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { CreateAnalysisFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";

export function validateConfigureBarChartStep(
  model: CreateAnalysisFormModel,
): FormikErrors<object> | undefined {
  if (
    model.diagramType === DiagramType.BAR_CHART &&
    model.configureBarChartFormModel.primaryAttributeSelectionKey ===
      model.configureBarChartFormModel.secondaryAttributeSelectionKey &&
    model.configureBarChartFormModel.primaryAttributeSelectionKey !== null
  ) {
    return {
      attributesMayNotMatch:
        "Das primäre und sekundäre Attribut darf nicht identisch sein.",
    };
  }

  return undefined;
}
