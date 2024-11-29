/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { NumberFilterValue } from "@/lib/shared/components/filterSettings/models/NumberFilter";

export type SuppertedEvaluationFilterValues = Extract<
  FilterValue,
  EnumFilterValue | NumberFilterValue
>;
