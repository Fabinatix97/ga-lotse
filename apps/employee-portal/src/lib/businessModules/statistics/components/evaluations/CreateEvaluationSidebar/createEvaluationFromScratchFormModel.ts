/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChooseAttributesStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/chooseAttributesStepFormModel";
import { ChooseEvaluationTemplateStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseEvaluationTemplateStep/chooseEvaluationTemplateStepFormModel";

import { ChooseDataSourceStepFormModel } from "./ChooseDataSourceStep/chooseDataSourceStepFormModel";
import { ConfigureDataSourceStepFormModel } from "./ConfigureDataSourceStep/configureDataSourceStepFormModel";
import { SummaryStepFormModel } from "./SummaryStep/summaryStepFormModel";

export type ChooseAttributeStepOrConfigureDataSourceStepFormModel =
  ChooseAttributesStepFormModel & ConfigureDataSourceStepFormModel;

export type ChooseEvaluationTemplateOrConfigureDataSourceStepFormModel =
  ChooseEvaluationTemplateStepFormModel & ConfigureDataSourceStepFormModel;

export type CreateEvaluationFromScratchFormModel = [
  ChooseDataSourceStepFormModel,
  ChooseEvaluationTemplateOrConfigureDataSourceStepFormModel,
  ChooseAttributeStepOrConfigureDataSourceStepFormModel,
  SummaryStepFormModel,
];
