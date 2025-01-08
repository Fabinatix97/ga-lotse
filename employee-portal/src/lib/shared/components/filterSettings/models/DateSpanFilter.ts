/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValueBase } from "@/lib/shared/components/filterSettings/models/FilterValue";

export interface DateSpanFilterDefinition extends FilterDefinitionBase {
  type: "DateSpan";
  maxInputPast?: boolean;
  doNotRequireStartAndEnd?: boolean;
}

export interface DateSpanFilterValue extends FilterValueBase {
  type: "DateSpan";
  startDate?: string;
  endDate?: string;
}
