/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDateString } from "@eshg/lib-portal/helpers/dateTime";

import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

export function getFilterDate(filterValues: FilterValue[], key: string) {
  const value = filterValues.find((filterValue) => filterValue.key === key);
  if (value?.type === "Date" && isDateString(value.selectedValue)) {
    return new Date(value.selectedValue);
  }
  return undefined;
}

export function getFilterSelectedValues<T extends string>(
  filterValues: FilterValue[],
  key: string,
  targetEnum: Record<string, T>,
): Set<T> | undefined {
  const value = filterValues.find((filterValue) => filterValue.key === key);
  if (!value || !("selectedValues" in value)) {
    return undefined;
  }

  const targetEnumValues: string[] = Object.values(targetEnum);
  const filteredSelectedValues = value.selectedValues.filter(
    (selectedValue): selectedValue is T =>
      targetEnumValues.includes(selectedValue),
  );
  if (filteredSelectedValues.length === 0) {
    return undefined;
  }
  return new Set(filteredSelectedValues);
}
