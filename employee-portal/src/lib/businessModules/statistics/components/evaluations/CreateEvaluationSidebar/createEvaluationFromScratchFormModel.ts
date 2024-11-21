/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChooseAttributesStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/chooseAttributesStepFormModel";
import { ChooseDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/chooseDataSourceStepFormModel";
import { ChooseEvaluationTemplateStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseEvaluationTemplateStep/chooseEvaluationTemplateStepFormModel";
import { ConfigureDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ConfigureDataSourceStep/configureDataSourceStepFormModel";
import { SummaryStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/SummaryStep/summaryStepFormModel";

export type CreateEvaluationFromScratchFormModel =
  ChooseDataSourceStepFormModel &
    ChooseAttributesStepFormModel &
    ChooseEvaluationTemplateStepFormModel &
    ConfigureDataSourceStepFormModel &
    SummaryStepFormModel;
