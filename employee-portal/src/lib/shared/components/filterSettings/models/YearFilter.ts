/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValueBase } from "@/lib/shared/components/filterSettings/models/FilterValue";

export interface YearFilterDefinition extends FilterDefinitionBase {
  type: "Year";
}

export interface YearFilterValue extends FilterValueBase {
  type: "Year";
  selectedValue: string;
}
