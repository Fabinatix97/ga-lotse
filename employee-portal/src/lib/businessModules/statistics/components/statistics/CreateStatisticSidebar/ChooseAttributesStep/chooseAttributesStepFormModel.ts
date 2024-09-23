/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CategorizedFlatAttribute } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseAttributesStep/ChooseAttributesStep";

export interface ChooseAttributesStepFormModel {
  selectedAttributes?: CategorizedFlatAttribute[];
}
