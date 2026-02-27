/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { startOfDay, subMonths } from "date-fns";

export function lastXMonthsInDate(today: Date, x: number) {
  return startOfDay(subMonths(today, x));
}
