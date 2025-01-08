/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValueBase } from "@/lib/shared/components/filterSettings/models/FilterValue";

export interface DateFilterDefinition extends FilterDefinitionBase {
  type: "Date";
}

export interface DateFilterValue extends FilterValueBase {
  type: "Date";
  selectedValue: string;
}
