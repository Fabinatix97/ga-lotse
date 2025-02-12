/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { NumberFilterValue } from "@/lib/shared/components/filterSettings/models/NumberFilter";
import { TextFilterValue } from "@/lib/shared/components/filterSettings/models/TextFilter";

export type SupportedEvaluationFilterValues = Extract<
  FilterValue,
  EnumFilterValue | NumberFilterValue | TextFilterValue
>;
