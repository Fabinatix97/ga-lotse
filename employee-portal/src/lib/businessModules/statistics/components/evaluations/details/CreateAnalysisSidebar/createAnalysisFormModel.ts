/**
 * Copyright 2024 cronn GmbH
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

export type CreateAnalysisFormModel = SelectDiagramStepFormModel &
  SaveAnalysisStepFormModel & {
    configureBarChartFormModel: ConfigureBarChartFormModel;
    configurePieChartFormModel: ConfigurePieChartFormModel;
    configureScatterChartFormModel: ConfigureScatterChartFormModel;
    configureLineChartFormModel: ConfigureLineChartFormModel;
    configureHistogramChartFormModel: ConfigureHistogramChartFormModel;
    configureChoroplethChartFormModel: ConfigureChoroplethChartFormModel;
  };
