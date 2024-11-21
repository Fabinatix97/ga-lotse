/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DataSource } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/ChooseDataSourceStep";

export interface ChooseDataSourceStepFormModel {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  _dataSourceId?: string | "CHOOSE_EVALUATION_TEMPLATE";
  dataSource?: DataSource;
}
