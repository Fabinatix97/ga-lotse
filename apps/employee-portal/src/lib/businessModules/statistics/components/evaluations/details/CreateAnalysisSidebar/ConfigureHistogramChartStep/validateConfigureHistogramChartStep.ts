/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";
import { isNumber } from "remeda";

import { ConfigureHistogramChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureHistogramChartStep/configureHistogramChartFormModel";

export function validateConfigureHistogramChartStep(
  model: ConfigureHistogramChartFormModel,
): FormikErrors<object> | undefined {
  if (
    model.binning === "MANUAL" &&
    isNumber(model.minBin) &&
    isNumber(model.maxBin) &&
    model.minBin >= model.maxBin
  ) {
    return {
      minBinMustBeLessThanMaxBin:
        "Das untere Bin-Zentrum muss kleiner als das obere Bin-Zentrum sein.",
    };
  }

  return undefined;
}
