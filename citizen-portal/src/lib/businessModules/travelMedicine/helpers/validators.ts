/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDateString } from "@eshg/lib-portal/helpers/dateTime";
import { endOfDay, isPast } from "date-fns";

export function validateTodayOrFutureDate(value: string) {
  if (isDateString(value) && isPast(endOfDay(value))) {
    return "Das Datum liegt in der Vergangenheit.";
  }

  return undefined;
}
