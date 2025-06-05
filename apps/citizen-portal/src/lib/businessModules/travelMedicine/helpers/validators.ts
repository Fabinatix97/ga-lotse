/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { endOfDay, isPast } from "date-fns";

import { isDateString } from "@eshg/lib-portal";

export function validateTodayOrFutureDate(value: string) {
  if (isDateString(value) && isPast(endOfDay(value))) {
    return "Das Datum liegt in der Vergangenheit.";
  }

  return undefined;
}
