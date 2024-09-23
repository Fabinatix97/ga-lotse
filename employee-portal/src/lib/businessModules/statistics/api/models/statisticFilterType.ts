/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetStatisticRequest } from "@eshg/employee-portal-api/statistics";

export type StatisticFilter = NonNullable<
  ApiGetStatisticRequest["filters"]
>[number];
