/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetEvaluationRequest } from "@eshg/employee-portal-api/statistics";

export type EvaluationFilter = NonNullable<
  ApiGetEvaluationRequest["filters"]
>[number];
