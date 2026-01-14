/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterValue } from "../types/FilterValue";

export function getSelectedEnumFilterValues(
  filters: FilterValue[],
  ...key: string[]
) {
  return filters
    .filter((filterValue) => key.includes(filterValue.key))
    .filter((filterValue) => filterValue.type === "Enum")
    .flatMap((filterValue) => filterValue.selectedValues);
}
