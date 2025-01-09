/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEvaluationState,
  ApiUser,
} from "@eshg/employee-portal-api/statistics";

import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";

export interface EvaluationOverviewTableItem {
  createdAt: Date;
  id: string;
  name: string;
  dataSourceName: string;
  state: ApiEvaluationState;
  timeRangeEnd: Date;
  timeRangeStart: Date;
  userId: string;
  user: ApiUser | undefined;
  tooMuchDataForExport: boolean;
  dataSourceSensitivity: DataSourceSensitivity;
}

export interface EvaluationOverview {
  data: EvaluationOverviewTableItem[];
  totalNumberOfElements: number;
}
