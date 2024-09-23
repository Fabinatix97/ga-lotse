/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChooseTemplateStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseTemplateStep/chooseTemplateStepFormModel";
import { SaveStatisticStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/SaveStatisticStep/saveStatisticStepFormModel";

export type CreateStatisticFromTemplateFormModel = ChooseTemplateStepFormModel &
  SaveStatisticStepFormModel;
