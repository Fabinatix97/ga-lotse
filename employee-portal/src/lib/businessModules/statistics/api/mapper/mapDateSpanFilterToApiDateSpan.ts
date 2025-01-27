/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDateSpan } from "@eshg/statistics-api";
import { addDays, parseISO, startOfDay } from "date-fns";

import { DateSpanFilterValue } from "@/lib/shared/components/filterSettings/models/DateSpanFilter";

export function mapDateSpanFilterToApiDateSpan(
  dateSpanFilter: DateSpanFilterValue | undefined,
  isEndInterval: boolean,
): ApiDateSpan | undefined {
  if (
    !dateSpanFilter ||
    (!dateSpanFilter.startDate && !dateSpanFilter.endDate)
  ) {
    return undefined;
  }

  const start = dateSpanFilter.startDate
    ? startOfDay(parseISO(dateSpanFilter.startDate))
    : undefined;
  const end = dateSpanFilter.endDate
    ? startOfDay(addDays(parseISO(dateSpanFilter.endDate), 1))
    : undefined;

  // See: ISSUE-7058
  if (isEndInterval) {
    start?.setMilliseconds(1);
    end?.setMilliseconds(1);
  }

  return {
    lowerBoundary: start,
    upperBoundary: end,
  };
}
