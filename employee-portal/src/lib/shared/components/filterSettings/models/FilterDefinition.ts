/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateComparisonFilterDefinition } from "@/lib/shared/components/filterSettings/models/DateComparisonFilter";
import { DateSpanFilterDefinition } from "@/lib/shared/components/filterSettings/models/DateSpanFilter";
import { EnumFilterDefinition } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { NumberFilterDefinition } from "@/lib/shared/components/filterSettings/models/NumberFilter";
import { YearFilterDefinition } from "@/lib/shared/components/filterSettings/models/YearFilter";

import { DateFilterDefinition } from "./DateFilter";
import { EnumSingleFilterDefinition } from "./EnumSingleFilter";

export interface FilterDefinitionBase {
  name: string;
  key: string;
  /** allows overwriting render option of group */
  inAccordion?: boolean;
}

export type FilterDefinition =
  | EnumFilterDefinition
  | EnumSingleFilterDefinition
  | DateFilterDefinition
  | DateSpanFilterDefinition
  | DateComparisonFilterDefinition
  | NumberFilterDefinition
  | YearFilterDefinition;
