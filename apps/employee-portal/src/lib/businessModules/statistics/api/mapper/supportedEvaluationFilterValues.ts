/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  EnumFilterValue,
  FilterValue,
  NumberFilterValue,
  TextFilterValue,
} from "@eshg/lib-employee-portal";

export type SupportedEvaluationFilterValues = Extract<
  FilterValue,
  EnumFilterValue | NumberFilterValue | TextFilterValue
>;
