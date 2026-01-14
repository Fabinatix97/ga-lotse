/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export const OPTIONAL_FALLBACK_VALUE = "-";

export function formatOptional<T>(
  value: T | undefined,
  formatFn: (value: T) => string,
  fallbackValue = OPTIONAL_FALLBACK_VALUE,
): string {
  if (value === undefined) {
    return fallbackValue;
  }

  return formatFn(value);
}

export function formatOptionalKey<T extends string>(
  value: T | undefined,
  formatDict: Record<T, string>,
  fallbackValue = OPTIONAL_FALLBACK_VALUE,
): string {
  if (value === undefined) {
    return fallbackValue;
  }

  return formatDict[value];
}
