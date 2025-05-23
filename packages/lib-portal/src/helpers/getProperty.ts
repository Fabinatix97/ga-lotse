/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isPlainObject } from "remeda";

export function getProperty(t: unknown, prop: string): unknown {
  if (!isPlainObject(t)) {
    return;
  }
  if (prop in t) {
    return t[prop];
  }
}

type TypePredicate<T> = (v: unknown) => v is T;
export function getPropertyIf<T>(
  t: unknown,
  prop: string,
  predicate: TypePredicate<T>,
): T | undefined {
  const value = getProperty(t, prop);
  return predicate(value) ? value : undefined;
}
