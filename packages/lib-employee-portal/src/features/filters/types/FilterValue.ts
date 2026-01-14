/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DateComparisonFilterDraftValue,
  DateComparisonFilterValue,
} from "./DateComparisonFilter";
import { DateFilterValue } from "./DateFilter";
import { DateSpanFilterValue } from "./DateSpanFilter";
import { EnumFilterValue } from "./EnumFilter";
import { EnumSingleFilterValue } from "./EnumSingleFilter";
import { NumberFilterDraftValue, NumberFilterValue } from "./NumberFilter";
import { TextFilterValue } from "./TextFilter";
import { YearFilterValue } from "./YearFilter";

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
