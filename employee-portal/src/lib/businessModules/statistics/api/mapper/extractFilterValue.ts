/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

export function extractFilterValue<T>(
  filterValues: FilterValue[],
  key: string,
): T | undefined {
  return filterValues.find((it) => it.key === key) as T | undefined;
}
