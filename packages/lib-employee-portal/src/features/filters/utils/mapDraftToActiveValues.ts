/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNonNull } from "remeda";

import { isEmptyString } from "@eshg/lib-portal";

import {
  DateComparisonFilterDraftValue,
  DateComparisonFilterValue,
} from "../types/DateComparisonFilter";
import { FilterDraftValue, FilterValue } from "../types/FilterValue";
import {
  NumberFilterComparisonMode,
  NumberFilterDraftComparisonMode,
  NumberFilterDraftValue,
  NumberFilterNullInclusion,
  NumberFilterValue,
} from "../types/NumberFilter";

export function mapDraftToActiveValues(
  draftValues: FilterDraftValue[],
): FilterValue[] {
  return draftValues
    .map((draftValue) => {
      switch (draftValue.type) {
        case "Number":
          return mapNumber(draftValue);
        case "DateComparison":
          return mapDateComparison(draftValue);
        default:
          return draftValue;
      }
    })
    .filter(isNonNull)
    .toSorted((draftValueA, draftValueB) =>
      draftValueA.key.localeCompare(draftValueB.key),
    );
}

function mapDateComparison(
  draftValue: DateComparisonFilterDraftValue,
): DateComparisonFilterValue | null {
  if (draftValue.value && draftValue.value.trim().length > 0) {
    return draftValue;
  }
  return null;
}

function mapNumber(
  draftValue: NumberFilterDraftValue,
): NumberFilterValue | null {
  if (draftValue.nullInclusion === NumberFilterNullInclusion.OnlyNull) {
    return {
      type: "Number",
      key: draftValue.key,
      comparison: {
        type: NumberFilterComparisonMode.Null,
        nullInclusion: draftValue.nullInclusion,
      },
    };
  } else if (
    draftValue.mode === NumberFilterDraftComparisonMode.Value &&
    !isEmptyString(draftValue.value)
  ) {
    return {
      type: "Number",
      key: draftValue.key,
      comparison: {
        type: NumberFilterComparisonMode.Value,
        nullInclusion: draftValue.nullInclusion,
        numericComparison: draftValue.numericComparison,
        value: draftValue.value,
      },
    };
  } else if (
    draftValue.mode === NumberFilterDraftComparisonMode.Range &&
    !isEmptyString(draftValue.minValueInclusive) &&
    !isEmptyString(draftValue.maxValueInclusive)
  ) {
    return {
      type: "Number",
      key: draftValue.key,
      comparison: {
        type: NumberFilterComparisonMode.Range,
        nullInclusion: draftValue.nullInclusion,
        minValueInclusive: Math.min(
          draftValue.minValueInclusive,
          draftValue.maxValueInclusive,
        ),
        maxValueInclusive: Math.max(
          draftValue.minValueInclusive,
          draftValue.maxValueInclusive,
        ),
      },
    };
  }
  return null;
}
