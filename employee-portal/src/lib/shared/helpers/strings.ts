/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Like `String.join(sep)` or remeda's join, but ignore `null` and `undefined`
 * array entries, and return `undefined` if _all_ entries are `null` or
 * `undefined`.
 */
export function join(
  strings: (string | null | undefined)[],
  sep = ",",
): string | undefined {
  return strings.filter(Boolean).join(sep) || undefined;
}
