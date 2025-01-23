/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChooseAttributesStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/chooseAttributesStepFormModel";
import { ChooseEvaluationTemplateStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseEvaluationTemplateStep/chooseEvaluationTemplateStepFormModel";

import { ChooseDataSourceStepFormModel } from "./ChooseDataSourceStep/chooseDataSourceStepFormModel";
import { ConfigureDataSourceStepFormModel } from "./ConfigureDataSourceStep/configureDataSourceStepFormModel";
import { SummaryStepFormModel } from "./SummaryStep/summaryStepFormModel";

export type ChooseAttributeStepOrChooseEvaluationStepFormModel =
  ChooseAttributesStepFormModel & ChooseEvaluationTemplateStepFormModel;

export type CreateEvaluationFromScratchFormModel = [
  ChooseDataSourceStepFormModel,
  ChooseAttributeStepOrChooseEvaluationStepFormModel,
  ConfigureDataSourceStepFormModel,
  SummaryStepFormModel,
];
