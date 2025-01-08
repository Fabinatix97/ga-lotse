/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined, mapToObj } from "remeda";

import { SelectOption } from "../components/formFields/SelectOptions";
import { OptionalFieldValue } from "../types/form";

import { toDateString, toUtcDate } from "./dateTime";
import { isEmptyString, isNonEmptyString } from "./guards";

export function createFieldNameMapper<T = Record<string, unknown>>(
  rootPath?: string,
) {
  return (fieldName: string & keyof T) =>
    isDefined(rootPath) ? `${rootPath}.${fieldName}` : fieldName;
}

export const NO_SELECTION_LABEL = "keine Auswahl";
export const NO_SELECTION: SelectOption = {
  label: NO_SELECTION_LABEL,
  value: "",
};

export function buildEnumOptions<TEnum extends string>(
  valueToLabelMap: Record<TEnum, string>,
  allowDeselection = false,
): SelectOption[] {
  const result = Object.entries<string>(valueToLabelMap).map(
    ([value, label]) => ({
      value,
      label,
    }),
  );
  if (allowDeselection) {
    result.push(NO_SELECTION);
  }
  return result;
}

export function parseOptionalValue<TValue>(
  value: TValue | undefined,
): OptionalFieldValue<TValue> {
  return value ?? "";
}

export function mapOptionalValue<T>(
  value: OptionalFieldValue<T>,
): T | undefined {
  return value === "" ? undefined : value;
}

export function mapOptionalDate(
  value: OptionalFieldValue<string>,
): Date | undefined {
  return value === "" ? undefined : toUtcDate(value);
}

export function parseOptionalDate(date: Date | undefined) {
  return isDefined(date) ? toDateString(date) : "";
}

export function mapNullableValue<T>(value: T | null): T | undefined {
  return value ?? undefined;
}

export function mapRequiredValue<TValue>(
  value: OptionalFieldValue<TValue> | null,
): TValue {
  if (isEmptyString(value) || value === null) {
    throw new Error("Value is expected to be non-empty.");
  }

  return value;
}

export function dropBlankStrings(strings: string[]): string[] {
  return strings.map((a) => a.trim()).filter((a) => a.length > 0);
}

export function addMissingKeys<TKey extends string, TValue>(
  values: Partial<Record<TKey, TValue>>,
  keys: TKey[],
): Record<TKey, OptionalFieldValue<TValue>> {
  const result: Partial<Record<TKey, OptionalFieldValue<TValue>>> = {};
  for (const key of keys) {
    result[key] = values[key] ?? "";
  }
  return result as Record<TKey, TValue>;
}

type NonEmpty<TValue> = Exclude<TValue, "">;

export function dropEmptyKeys<TKey extends string, TValue>(
  values: Record<TKey, TValue>,
): Partial<Record<TKey, NonEmpty<TValue>>> {
  const result: Partial<Record<TKey, NonEmpty<TValue>>> = {};
  for (const [key, value] of Object.entries<TValue>(values)) {
    if (isNonEmptyString(value)) {
      result[key as TKey] = value as NonEmpty<TValue>;
    }
  }
  return result;
}

export function createEmptyKeys<TKey extends string, TValue>(
  keys: TKey[],
): Record<TKey, OptionalFieldValue<TValue>> {
  return mapToObj(keys, (key) => [key, ""]);
}
