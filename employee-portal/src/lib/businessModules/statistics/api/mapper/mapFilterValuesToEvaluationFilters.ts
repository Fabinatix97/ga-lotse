/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapKeyToAttributeSelection } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { EvaluationFilter } from "@/lib/businessModules/statistics/api/models/evaluationFilterType";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  getSearchValues,
  shouldSearchForFalse,
  shouldSearchForNull,
  shouldSearchForTrue,
} from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import {
  NumberFilterComparisonMode,
  NumberFilterNullInclusion,
} from "@/lib/shared/components/filterSettings/models/NumberFilter";
import { assertFilterType } from "@/lib/shared/components/filterSettings/models/assertFilterType";

export function mapFilterValuesToEvaluationFilters(
  filterValues: FilterValue[],
  attributes: FlatAttribute[],
): EvaluationFilter[] {
  const evaluationFilters: EvaluationFilter[] = filterValues.map(
    (filterValue) => {
      const attribute = attributes.find(
        (attribute) => attribute.key === filterValue.key,
      )!;
      const attributeSelection = mapKeyToAttributeSelection(attribute.key);

      switch (attribute.type) {
        case "ValueWithOptionsAttribute":
          assertFilterType(filterValue, "Enum");
          return {
            type: "ValueOptionFilterParameter",
            attribute: attributeSelection,
            searchValues: getSearchValues(filterValue.selectedValues),
            searchForNull: shouldSearchForNull(filterValue.selectedValues),
          } satisfies EvaluationFilter;
        case "BooleanAttribute":
          assertFilterType(filterValue, "Enum");
          return {
            type: "BooleanFilterParameter",
            attribute: attributeSelection,
            searchForTrue: shouldSearchForTrue(filterValue.selectedValues),
            searchForFalse: shouldSearchForFalse(filterValue.selectedValues),
            searchForNull: shouldSearchForNull(filterValue.selectedValues),
          } satisfies EvaluationFilter;
        case "IntegerAttribute":
        case "DecimalAttribute":
          assertFilterType(filterValue, "Number");
          if (
            filterValue.comparison.nullInclusion ===
            NumberFilterNullInclusion.OnlyNull
          ) {
            return {
              type: "NullFilterParameter",
              attribute: attributeSelection,
            } satisfies EvaluationFilter;
          }

          const withNullValues =
            filterValue.comparison.nullInclusion ===
            NumberFilterNullInclusion.IncludeNull;

          if (
            filterValue.comparison.type === NumberFilterComparisonMode.Range
          ) {
            return {
              type:
                attribute.type === "IntegerAttribute"
                  ? "IntegerRangeFilterParameter"
                  : "DecimalRangeFilterParameter",
              attribute: attributeSelection,
              minValueInclusive: filterValue.comparison.minValueInclusive,
              maxValueInclusive: filterValue.comparison.maxValueInclusive,
              withNullValues: withNullValues,
            } satisfies EvaluationFilter;
          }
          if (
            filterValue.comparison.type === NumberFilterComparisonMode.Value
          ) {
            return {
              type:
                attribute.type === "IntegerAttribute"
                  ? "IntegerValueFilterParameter"
                  : "DecimalValueFilterParameter",
              attribute: attributeSelection,
              numericComparison: filterValue.comparison.numericComparison,
              value: filterValue.comparison.value,
              withNullValues: withNullValues,
            } satisfies EvaluationFilter;
          }
        case "TextAttribute":
          assertFilterType(filterValue, "Text");
          return {
            type: "TextFilterParameter",
            text: filterValue.value,
            attribute: attributeSelection,
          } satisfies EvaluationFilter;
        case "DateAttribute":
          assertFilterType(filterValue, "Text");
          return {
            type: "DateFilterParameter",
            date: filterValue.value,
            attribute: attributeSelection,
          } satisfies EvaluationFilter;
        default:
          throw new Error(`Attribute of type ${attribute.type} not expected`);
      }
    },
  );
  return evaluationFilters;
}
