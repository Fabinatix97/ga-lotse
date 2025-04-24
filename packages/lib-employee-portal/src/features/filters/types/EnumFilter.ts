/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "./FilterDefinition";
import { FilterValueBase } from "./FilterValue";

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
