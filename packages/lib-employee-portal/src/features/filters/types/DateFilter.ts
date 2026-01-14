/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "./FilterDefinition";
import { FilterValueBase } from "./FilterValue";

export interface DateFilterDefinition extends FilterDefinitionBase {
  type: "Date";
}

export interface DateFilterValue extends FilterValueBase {
  type: "Date";
  selectedValue: string;
}
