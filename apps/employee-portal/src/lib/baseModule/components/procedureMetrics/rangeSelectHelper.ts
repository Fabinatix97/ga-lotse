/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { startOfDay, subMonths } from "date-fns";

export function lastXMonthsInDate(today: Date, x: number) {
  return startOfDay(subMonths(today, x));
}
