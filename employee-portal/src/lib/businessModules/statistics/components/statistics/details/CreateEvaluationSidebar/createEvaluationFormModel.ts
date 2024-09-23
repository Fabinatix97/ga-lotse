/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigureBarChartFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureBarChartStep/configureBarChartFormModel";
import { ConfigureChoroplethChartFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureChoroplethChartStep/configureChoroplethChartFormModel";
import { ConfigureHistogramChartFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureHistogramChartStep/configureHistogramChartFormModel";
import { ConfigureLineChartFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureLineChartStep/configureLineChartFormModel";
import { ConfigurePieChartFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigurePieChartStep/configurePieChartFormModel";
import { ConfigureScatterChartFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureScatterChartStep/configureScatterChartFormModel";
import { SaveEvaluationStepFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/SaveEvaluationStep/saveEvaluationStepFormModel";
import { SelectDiagramStepFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/SelectDiagramStep/selectDiagramStepFormModel";

export type CreateEvaluationFormModel = SelectDiagramStepFormModel &
  SaveEvaluationStepFormModel & {
    configureBarChartFormModel: ConfigureBarChartFormModel;
    configurePieChartFormModel: ConfigurePieChartFormModel;
    configureScatterChartFormModel: ConfigureScatterChartFormModel;
    configureLineChartFormModel: ConfigureLineChartFormModel;
    configureHistogramChartFormModel: ConfigureHistogramChartFormModel;
    configureChoroplethChartFormModel: ConfigureChoroplethChartFormModel;
  };
