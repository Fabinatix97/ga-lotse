/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Like `String.join(sep)` or remeda's join, but ignore `null` and `undefined`
 * array entries, and return `undefined` if _all_ entries are `null` or
 * `undefined`.
 */
export function formatList(
  values: (string | null | undefined)[],
  separator = ",",
): string | undefined {
  return values.filter(Boolean).join(separator) || undefined;
}
