/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDraftValue, FilterValue } from "../types/FilterValue";
import {
  NumberFilterComparisonMode,
  NumberFilterNullInclusion,
  defaultNumberFilterDraftValue,
} from "../types/NumberFilter";

export function mapActiveToDraftValues(
  activeValues: FilterValue[],
): FilterDraftValue[] {
  return activeValues.map((activeValue) => {
    switch (activeValue.type) {
      case "Number":
        const defaultDraftValue = defaultNumberFilterDraftValue(
          activeValue.key,
        );
        switch (activeValue.comparison.type) {
          case NumberFilterComparisonMode.Null:
            return {
              ...defaultDraftValue,
              nullInclusion: NumberFilterNullInclusion.OnlyNull,
            };
          case NumberFilterComparisonMode.Value:
            return {
              ...defaultDraftValue,
              nullInclusion: activeValue.comparison.nullInclusion,
              mode: activeValue.comparison.type,
              numericComparison: activeValue.comparison.numericComparison,
              value: activeValue.comparison.value,
            };
          case NumberFilterComparisonMode.Range:
            return {
              ...defaultDraftValue,
              nullInclusion: activeValue.comparison.nullInclusion,
              mode: activeValue.comparison.type,
              minValueInclusive: activeValue.comparison.minValueInclusive,
              maxValueInclusive: activeValue.comparison.maxValueInclusive,
            };
        }
      default:
        return activeValue;
    }
  });
}
