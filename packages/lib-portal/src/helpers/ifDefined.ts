/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function ifDefined<T, K>(
  a: T,
  predicate: (t: NonNullable<T>) => K,
): K | undefined {
  if (a === undefined || a === null) {
    return;
  }
  return predicate(a);
}
