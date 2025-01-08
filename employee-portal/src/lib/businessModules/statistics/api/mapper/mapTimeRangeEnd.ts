/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addDays, endOfDay, startOfDay, subDays } from "date-fns";

export function mapTimeRangeEndApiToFrontend(endDate: Date) {
  return endOfDay(subDays(endDate, 1));
}

export function mapTimeRangeEndFrontendToApi(endDate: Date) {
  return startOfDay(addDays(endDate, 1));
}
