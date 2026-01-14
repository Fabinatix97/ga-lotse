/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "./FilterDefinition";
import { FilterValueBase } from "./FilterValue";

export interface DateSpanFilterDefinition extends FilterDefinitionBase {
  type: "DateSpan";
  maxInputPast?: boolean;
  doNotRequireStartAndEnd?: boolean;
  showTodayButton?: boolean;
}

export interface DateSpanFilterValue extends FilterValueBase {
  type: "DateSpan";
  startDate?: string;
  endDate?: string;
}
