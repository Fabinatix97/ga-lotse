/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetEvaluationRequest } from "@eshg/statistics-api";

export type EvaluationFilter = NonNullable<
  ApiGetEvaluationRequest["filters"]
>[number];
