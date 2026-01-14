/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";
import { isNonNullish } from "remeda";

import { ConfigureChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";

export function validateConfigureBarChartStep(
  model: ConfigureChartFormModel,
): FormikErrors<object> | undefined {
  if (
    isNonNullish(model.primaryAttribute) &&
    model.primaryAttribute !== "" &&
    model.primaryAttribute === model.secondaryAttribute
  ) {
    return {
      attributesMayNotMatch:
        "Das primäre und sekundäre Attribut darf nicht identisch sein.",
    };
  }

  return undefined;
}
