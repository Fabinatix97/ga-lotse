/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapAttributeSelectionToKey } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { StatisticFilter } from "@/lib/businessModules/statistics/api/models/statisticFilterType";
import {
  ENUM_EMPTY_FIELDS_VALUE,
  ENUM_FALSE_VALUE,
  ENUM_TRUE_VALUE,
} from "@/lib/businessModules/statistics/components/statistics/details/filter/enumFilterMappings";

import { SuppertedStatisticsFilterValues } from "./suppertedStatisticsFilterValues";

export function mapStatisticFilterToFilterValue(
  filter: StatisticFilter,
): SuppertedStatisticsFilterValues {
  switch (filter.type) {
    case "ValueOptionFilterParameter": {
      const selectedValues = filter.searchValues;
      if (filter.searchForNull) {
        selectedValues.push(ENUM_EMPTY_FIELDS_VALUE);
      }

      return {
        type: "Enum",
        key: mapAttributeSelectionToKey(filter.attribute),
        selectedValues: selectedValues,
      };
    }
    case "BooleanFilterParameter": {
      const selectedValues = [];
      if (filter.searchForTrue) {
        selectedValues.push(ENUM_TRUE_VALUE);
      }
      if (filter.searchForFalse) {
        selectedValues.push(ENUM_FALSE_VALUE);
      }
      if (filter.searchForNull) {
        selectedValues.push(ENUM_EMPTY_FIELDS_VALUE);
      }
      return {
        type: "Enum",
        key: mapAttributeSelectionToKey(filter.attribute),
        selectedValues: selectedValues,
      };
    }
    case "NullFilterParameter":
      return {
        type: "Number",
        key: mapAttributeSelectionToKey(filter.attribute),
        comparison: {
          type: "NULL",
          nullInclusion: "ONLY_NULL",
        },
      };
    case "IntegerValueFilterParameter":
    case "DecimalValueFilterParameter":
      return {
        type: "Number",
        key: mapAttributeSelectionToKey(filter.attribute),
        comparison: {
          type: "VALUE",
          value: filter.value,
          numericComparison: filter.numericComparison,
          nullInclusion: filter.withNullValues
            ? "INCLUDE_NULL"
            : "EXCLUDE_NULL",
        },
      };
    case "IntegerRangeFilterParameter":
    case "DecimalRangeFilterParameter":
      return {
        type: "Number",
        key: mapAttributeSelectionToKey(filter.attribute),
        comparison: {
          type: "RANGE",
          minValueInclusive: filter.minValueInclusive,
          maxValueInclusive: filter.maxValueInclusive,
          nullInclusion: filter.withNullValues
            ? "INCLUDE_NULL"
            : "EXCLUDE_NULL",
        },
      };
    default:
      throw new Error("Not Implemented!");
  }
}
