/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DataSource } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseDataSourceStep/ChooseDataSourceStep";

export interface ChooseDataSourceStepFormModel {
  dataSource?: DataSource;
}
