/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValueBase } from "@/lib/shared/components/filterSettings/models/FilterValue";

export interface EnumFilterOption {
  label: string;
  value: string;
}

export interface EnumFilterDefinition extends FilterDefinitionBase {
  type: "Enum";
  options: EnumFilterOption[];
}

export interface EnumFilterValue extends FilterValueBase {
  type: "Enum";
  selectedValues: string[];
}
