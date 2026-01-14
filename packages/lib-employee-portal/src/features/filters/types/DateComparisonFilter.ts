/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { OptionalFieldValue } from "@eshg/lib-portal";

import { FilterDefinitionBase } from "./FilterDefinition";
import { FilterValueBase } from "./FilterValue";

export interface DateComparisonFilterDefinition extends FilterDefinitionBase {
  type: "DateComparison";
}

export const DateComparisonOperator = {
  Equal: "EQUAL",
  GreaterEqual: "GREATER_EQUAL",
  LessEqual: "LESS_EQUAL",
} as const;
export type DateComparisonOperator =
  (typeof DateComparisonOperator)[keyof typeof DateComparisonOperator];

export interface DateComparisonFilterValue extends FilterValueBase {
  type: "DateComparison";
  operator: DateComparisonOperator;
  value: string;
}

export interface DateComparisonFilterDraftValue extends FilterValueBase {
  type: "DateComparison";
  operator: DateComparisonOperator;
  value: OptionalFieldValue<string>;
}
