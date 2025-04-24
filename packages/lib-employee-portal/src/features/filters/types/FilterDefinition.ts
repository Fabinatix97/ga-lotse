/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateComparisonFilterDefinition } from "./DateComparisonFilter";
import { DateFilterDefinition } from "./DateFilter";
import { DateSpanFilterDefinition } from "./DateSpanFilter";
import { EnumFilterDefinition } from "./EnumFilter";
import { EnumSingleFilterDefinition } from "./EnumSingleFilter";
import { NumberFilterDefinition } from "./NumberFilter";
import { TextFilterDefinition } from "./TextFilter";
import { YearFilterDefinition } from "./YearFilter";

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
  | YearFilterDefinition
  | TextFilterDefinition;
