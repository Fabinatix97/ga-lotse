/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEvaluationState,
  ApiUser,
} from "@eshg/employee-portal-api/statistics";

export interface StatisticOverviewTableItem {
  createdAt: Date;
  id: string;
  name: string;
  dataSourceName: string;
  state: ApiEvaluationState;
  timeRangeEnd: Date;
  timeRangeStart: Date;
  userId: string;
  user: ApiUser | undefined;
  anonymized: boolean;
}

export interface StatisticOverview {
  data: StatisticOverviewTableItem[];
  totalNumberOfElements: number;
}
