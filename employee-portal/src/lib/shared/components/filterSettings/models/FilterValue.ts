/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import {
  NumberFilterDraftValue,
  NumberFilterValue,
} from "@/lib/shared/components/filterSettings/models/NumberFilter";
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
  | EnumFilterValue
  | EnumSingleFilterValue
  | NumberFilterValue
  | YearFilterValue;

export type FilterDraftValue =
  | DateFilterValue
  | DateSpanFilterValue
  | EnumFilterValue
  | EnumSingleFilterValue
  | NumberFilterDraftValue
  | YearFilterValue;
