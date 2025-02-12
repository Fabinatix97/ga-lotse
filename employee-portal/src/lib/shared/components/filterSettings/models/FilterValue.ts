/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DateComparisonFilterDraftValue,
  DateComparisonFilterValue,
} from "@/lib/shared/components/filterSettings/models/DateComparisonFilter";
import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import {
  NumberFilterDraftValue,
  NumberFilterValue,
} from "@/lib/shared/components/filterSettings/models/NumberFilter";
import { TextFilterValue } from "@/lib/shared/components/filterSettings/models/TextFilter";
import { YearFilterValue } from "@/lib/shared/components/filterSettings/models/YearFilter";

import { DateFilterValue } from "./DateFilter";
import { DateSpanFilterValue } from "./DateSpanFilter";
import { EnumSingleFilterValue } from "./EnumSingleFilter";

export interface FilterValueBase {
  key: string;
}

export type FilterValue =
  | DateFilterValue
  | DateSpanFilterValue
  | DateComparisonFilterValue
  | EnumFilterValue
  | EnumSingleFilterValue
  | NumberFilterValue
  | YearFilterValue
  | TextFilterValue;

export type FilterDraftValue =
  | DateFilterValue
  | DateSpanFilterValue
  | DateComparisonFilterDraftValue
  | EnumFilterValue
  | EnumSingleFilterValue
  | NumberFilterDraftValue
  | YearFilterValue
  | TextFilterValue;
