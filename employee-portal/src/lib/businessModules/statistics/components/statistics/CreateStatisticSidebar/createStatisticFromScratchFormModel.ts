/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChooseAttributesStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseAttributesStep/chooseAttributesStepFormModel";
import { ChooseDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseDataSourceStep/chooseDataSourceStepFormModel";
import { SaveStatisticStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/SaveStatisticStep/saveStatisticStepFormModel";

export type CreateStatisticFromScratchFormModel =
  ChooseDataSourceStepFormModel &
    ChooseAttributesStepFormModel &
    SaveStatisticStepFormModel;
