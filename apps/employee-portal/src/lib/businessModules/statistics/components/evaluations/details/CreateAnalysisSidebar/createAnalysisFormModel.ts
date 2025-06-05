/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigureBarChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureBarChartStep/configureBarChartFormModel";
import { ConfigureChoroplethChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureChoroplethChartStep/configureChoroplethChartFormModel";
import { ConfigureHistogramChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureHistogramChartStep/configureHistogramChartFormModel";
import { ConfigureLineChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureLineChartStep/configureLineChartFormModel";
import { ConfigurePieChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigurePieChartStep/configurePieChartFormModel";
import { ConfigureScatterChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureScatterChartStep/configureScatterChartFormModel";
import { SaveAnalysisStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SaveAnalysisStep/saveAnalysisStepFormModel";
import { SelectDiagramStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SelectDiagramStep/selectDiagramStepFormModel";

export type CreateAnalysisFormModel = [
  SelectDiagramStepFormModel,
  ConfigureChartFormModel,
  SaveAnalysisStepFormModel,
];

export type ConfigureChartFormModel = ConfigureBarChartFormModel &
  ConfigurePieChartFormModel &
  ConfigureScatterChartFormModel &
  ConfigureLineChartFormModel &
  ConfigureHistogramChartFormModel &
  ConfigureChoroplethChartFormModel;

export type BarChartMetaFormModel = Pick<
  ConfigureBarChartFormModel,
  "orientation" | "grouping" | "scaling"
>;

export type HistogramChartMetaFormModel = Pick<
  ConfigureHistogramChartFormModel,
  "grouping" | "scaling"
>;

export type ScatterChartMetaFormModel = Pick<
  ConfigureScatterChartFormModel,
  "trendline" | "axisRange"
>;

export type LineChartMetaFormModel = Pick<
  ConfigureLineChartFormModel,
  "axisRange"
>;

export type ChoroplethChartMetaFormModel = Pick<
  ConfigureChoroplethChartFormModel,
  "colorScheme"
>;
