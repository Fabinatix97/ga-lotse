/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

import { FilterDefinitionBase } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValueBase } from "@/lib/shared/components/filterSettings/models/FilterValue";

export const NumberFilterNullInclusion = {
  IncludeNull: "INCLUDE_NULL",
  ExcludeNull: "EXCLUDE_NULL",
  OnlyNull: "ONLY_NULL",
} as const;
export type NumberFilterNullInclusion =
  (typeof NumberFilterNullInclusion)[keyof typeof NumberFilterNullInclusion];

export const NumberFilterNumericComparison = {
  Equal: "EQUAL",
  GreaterEqual: "GREATER_EQUAL",
  GreaterThan: "GREATER_THAN",
  LessEqual: "LESS_EQUAL",
  LessThan: "LESS_THAN",
} as const;
export type NumberFilterNumericComparison =
  (typeof NumberFilterNumericComparison)[keyof typeof NumberFilterNumericComparison];

export interface NumberFilterDefinition extends FilterDefinitionBase {
  type: "Number";
  minValue: number | undefined;
  maxValue: number | undefined;
  unit: string | undefined;
}

export interface NumberFilterValue extends FilterValueBase {
  type: "Number";
  comparison:
    | NumberFilterRangeComparison
    | NumberFilterValueComparison
    | NumberFilterOnlyNullComparison;
}

export interface NumberFilterRangeComparison {
  type: typeof NumberFilterComparisonMode.Range;
  nullInclusion:
    | typeof NumberFilterNullInclusion.ExcludeNull
    | typeof NumberFilterNullInclusion.IncludeNull;
  minValueInclusive: number;
  maxValueInclusive: number;
}

export interface NumberFilterValueComparison {
  type: typeof NumberFilterComparisonMode.Value;
  nullInclusion:
    | typeof NumberFilterNullInclusion.ExcludeNull
    | typeof NumberFilterNullInclusion.IncludeNull;
  numericComparison: NumberFilterNumericComparison;
  value: number;
}

export interface NumberFilterOnlyNullComparison {
  type: typeof NumberFilterComparisonMode.Null;
  nullInclusion: typeof NumberFilterNullInclusion.OnlyNull;
}

export const NumberFilterComparisonMode = {
  Value: "VALUE",
  Range: "RANGE",
  Null: "NULL",
} as const;
export type NumberFilterComparisonMode =
  (typeof NumberFilterComparisonMode)[keyof typeof NumberFilterComparisonMode];

export const NumberFilterDraftComparisonMode = {
  Value: NumberFilterComparisonMode.Value,
  Range: NumberFilterComparisonMode.Range,
} as const;
export type NumberFilterDraftComparisonMode =
  (typeof NumberFilterDraftComparisonMode)[keyof typeof NumberFilterDraftComparisonMode];

export interface NumberFilterDraftValue extends FilterValueBase {
  type: "Number";
  nullInclusion: NumberFilterNullInclusion;
  mode: NumberFilterDraftComparisonMode;

  numericComparison: NumberFilterNumericComparison;
  value: OptionalFieldValue<number>;

  minValueInclusive: OptionalFieldValue<number>;
  maxValueInclusive: OptionalFieldValue<number>;
}

export function defaultNumberFilterDraftValue(
  key: string,
): NumberFilterDraftValue {
  return {
    type: "Number",
    key,
    nullInclusion: NumberFilterNullInclusion.ExcludeNull,
    mode: NumberFilterDraftComparisonMode.Value,

    numericComparison: NumberFilterNumericComparison.Equal,
    value: "",

    minValueInclusive: "",
    maxValueInclusive: "",
  };
}
