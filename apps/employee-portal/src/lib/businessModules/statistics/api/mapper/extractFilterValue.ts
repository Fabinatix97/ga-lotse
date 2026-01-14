/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FilterValue } from "@eshg/lib-employee-portal";

export function extractFilterValue<T>(
  filterValues: FilterValue[],
  key: string,
): T | undefined {
  return filterValues.find((it) => it.key === key) as T | undefined;
}
