/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DiagramType } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  BarChartMetaFormModel,
  ChoroplethChartMetaFormModel,
  HistogramChartMetaFormModel,
  LineChartMetaFormModel,
  ScatterChartMetaFormModel,
} from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";

import { UpdateNameStepFormModel } from "./UpdateNameStep";

type ChartMetaFormModel =
  | (Partial<BarChartMetaFormModel> & { type: DiagramType.BAR_CHART })
  | (Partial<HistogramChartMetaFormModel> & {
      type: DiagramType.HISTOGRAM_CHART;
    })
  | (ScatterChartMetaFormModel & { type: DiagramType.SCATTER_CHART })
  | (LineChartMetaFormModel & { type: DiagramType.LINE_CHART })
  | (ChoroplethChartMetaFormModel & { type: DiagramType.CHOROPLETH_CHART })
  | { type: DiagramType.PIE_CHART };

export type UpdateAnalysisFormModelStep = ChartMetaFormModel &
  UpdateNameStepFormModel;

export type UpdateAnalysisFormModel = [UpdateAnalysisFormModelStep];
