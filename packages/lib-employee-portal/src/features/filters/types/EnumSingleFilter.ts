/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "./FilterDefinition";
import { FilterValueBase } from "./FilterValue";

interface EnumSingleFilterOption {
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
