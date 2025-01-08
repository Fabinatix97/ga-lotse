/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPercentiles } from "@eshg/employee-portal-api/schoolEntry";

export interface Percentiles {
  bmi?: number;
  bmiPercentile?: number;
  heightPercentile?: number;
  weightPercentile?: number;
}

export function mapPercentiles(response: ApiPercentiles): Percentiles {
  return {
    bmi: response.bmi,
    bmiPercentile: response.bmiPercentile,
    heightPercentile: response.heightPercentile,
    weightPercentile: response.weightPercentile,
  };
}
