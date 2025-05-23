/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePrevious } from "./usePrevious";

interface UseHasChangedOptions<TValue> {
  /**
   * Defines the comparison function determining a changed value
   *
   * @default sameAs - Compare values by strict equality (===)
   */
  compareFn?: (prevValue: TValue | undefined, currentValue: TValue) => boolean;
  /**
   * When true, the initial value is counted as a change
   *
   * @default false
   */
  changedOnInit?: boolean;
}

/**
 * Compares value to previous value and return true when the value changed
 *
 * By default, values are compared by identity (===).
 */
export function useHasChanged<TValue>(
  value: TValue,
  options: UseHasChangedOptions<TValue> = {},
): boolean {
  const compareFn = options.compareFn ?? sameAs<TValue>;
  const changedOnInit = options.changedOnInit ?? false;

  const previousValue = usePrevious(value, changedOnInit);
  return !compareFn(previousValue, value);
}

function sameAs<TValue>(
  prevValue: TValue | undefined,
  currentValue: TValue,
): boolean {
  return currentValue === prevValue;
}
