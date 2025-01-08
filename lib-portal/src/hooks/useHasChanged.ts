/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePrevious } from "./usePrevious";

/**
 * Compares value to previous value and return true when the value changed
 *
 * By default, values are compared by identity (===).
 */
export function useHasChanged<TValue>(
  value: TValue,
  compareFn = sameAs<TValue>,
): boolean {
  const previousValue = usePrevious(value);
  return !compareFn(previousValue, value);
}

function sameAs<TValue>(
  prevValue: TValue | undefined,
  currentValue: TValue,
): boolean {
  return currentValue === prevValue;
}
