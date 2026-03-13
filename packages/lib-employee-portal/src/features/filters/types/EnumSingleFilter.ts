/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { GroupedOption } from "../../../../../lib-portal/build/types/src/components/formFields/SelectField";

import { FilterDefinitionBase } from "./FilterDefinition";
import { FilterValueBase } from "./FilterValue";

interface EnumSingleFilterOption {
  label: string;
  value: string;
}

export interface EnumSingleFilterDefinition extends FilterDefinitionBase {
  type: "EnumSingle";
  options?: EnumSingleFilterOption[] | undefined;
  placeholder?: string;
  groupedOptions?: Record<string, GroupedOption[]>;
}

export interface EnumSingleFilterValue extends FilterValueBase {
  type: "EnumSingle";
  selectedValue: string;
}
