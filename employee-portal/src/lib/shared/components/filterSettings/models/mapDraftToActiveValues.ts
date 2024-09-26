/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { isNonNull } from "remeda";

import {
  FilterDraftValue,
  FilterValue,
} from "@/lib/shared/components/filterSettings/models/FilterValue";
import {
  NumberFilterComparisonMode,
  NumberFilterDraftComparisonMode,
  NumberFilterDraftValue,
  NumberFilterNullInclusion,
  NumberFilterValue,
} from "@/lib/shared/components/filterSettings/models/NumberFilter";

export function mapDraftToActiveValues(
  draftValues: FilterDraftValue[],
): FilterValue[] {
  return draftValues
    .map((draftValue) => {
      switch (draftValue.type) {
        case "Number":
          return mapNumber(draftValue);
        default:
          return draftValue;
      }
    })
    .filter(isNonNull)
    .toSorted((draftValueA, draftValueB) =>
      draftValueA.key.localeCompare(draftValueB.key),
    );
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
