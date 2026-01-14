/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDateString } from "@eshg/lib-portal";

import { FilterValue } from "../types/FilterValue";

export function getFilterDate(filterValues: FilterValue[], key: string) {
  const value = filterValues.find((filterValue) => filterValue.key === key);
  if (value?.type === "Date" && isDateString(value.selectedValue)) {
    return new Date(value.selectedValue);
  }
  return undefined;
}

export function getFilterSelectedValue(
  filterValues: FilterValue[],
  key: string,
) {
  const value = filterValues.find((filterValue) => filterValue.key === key);
  if (value && "selectedValue" in value) {
    return value.selectedValue;
  }
  return undefined;
}

export function getFilterSelectedValues<T extends string>(
  filterValues: FilterValue[],
  key: string,
  targetEnum: Record<string, T>,
): T[] | undefined {
  const value = filterValues.find((filterValue) => filterValue.key === key);
  if (!value || !("selectedValues" in value)) {
    return undefined;
  }

  const filteredSelectedValues = value.selectedValues.filter((selectedValue) =>
    isInEnum(selectedValue, targetEnum),
  );
  if (filteredSelectedValues.length === 0) {
    return undefined;
  }
  return filteredSelectedValues;
}

export function isInEnum<T extends string>(
  value: string | undefined,
  targetEnum: Record<string, T>,
): value is T {
  const targetEnumValues: string[] = Object.values(targetEnum);
  return value !== undefined && targetEnumValues.includes(value);
}
