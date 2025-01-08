/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValueBase } from "@/lib/shared/components/filterSettings/models/FilterValue";

export interface EnumSingleFilterOption {
  label: string;
  value: string;
}

export interface EnumSingleFilterDefinition extends FilterDefinitionBase {
  type: "EnumSingle";
  options: EnumSingleFilterOption[];
  placeholder?: string;
}

export interface EnumSingleFilterValue extends FilterValueBase {
  type: "EnumSingle";
  selectedValue: string;
}
