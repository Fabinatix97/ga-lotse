/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiValueOption } from "@eshg/employee-portal-api/statistics";

import { EnumFilterOption } from "@/lib/shared/components/filterSettings/models/EnumFilter";

export const ENUM_EMPTY_FIELDS_VALUE = "__EMPTY_FIELDS_VALUE__";
export const ENUM_TRUE_VALUE = "yes";
export const ENUM_FALSE_VALUE = "no";

export const emptyFieldsOption: EnumFilterOption = {
  label: "Leere Felder",
  value: ENUM_EMPTY_FIELDS_VALUE,
};

export function mapEnumOptions(
  valueOptions: ApiValueOption[],
): EnumFilterOption[] {
  const options = valueOptions.map((option) => ({
    label: option.meaning,
    value: option.value,
  }));

  return [...options, emptyFieldsOption];
}

export const booleanOptions: EnumFilterOption[] = [
  { label: "Ja", value: ENUM_TRUE_VALUE },
  { label: "Nein", value: ENUM_FALSE_VALUE },
  emptyFieldsOption,
];

export function shouldSearchForTrue(selectedValues: string[]) {
  return selectedValues.includes(ENUM_TRUE_VALUE);
}

export function shouldSearchForFalse(selectedValues: string[]) {
  return selectedValues.includes(ENUM_FALSE_VALUE);
}

export function shouldSearchForNull(selectedValues: string[]) {
  return selectedValues.includes(ENUM_EMPTY_FIELDS_VALUE);
}

export function getSearchValues(selectedValues: string[]): string[] {
  return selectedValues.filter((value) => value !== ENUM_EMPTY_FIELDS_VALUE);
}
