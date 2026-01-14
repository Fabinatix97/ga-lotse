/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { endOfToday, formatISO, subMonths } from "date-fns";

export function getLastXMonthsTimeRange(numberOfMonths: number) {
  const today = endOfToday();
  const end = formatISO(today, { representation: "date" });
  const start = formatISO(subMonths(today, numberOfMonths), {
    representation: "date",
  });
  return { start, end };
}
