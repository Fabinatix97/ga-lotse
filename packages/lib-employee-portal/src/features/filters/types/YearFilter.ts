/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "./FilterDefinition";
import { FilterValueBase } from "./FilterValue";

export interface YearFilterDefinition extends FilterDefinitionBase {
  type: "Year";
}

export interface YearFilterValue extends FilterValueBase {
  type: "Year";
  selectedValue: string;
}
