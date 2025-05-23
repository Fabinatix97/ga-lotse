/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function assertNonEmptyArray<TItem>(
  array: TItem[],
): asserts array is [TItem, ...TItem[]] {
  if (array.length === 0) {
    throw Error("Array is expected to be non-empty");
  }
}

export function assertNever(x: never, message = "Unexpected object:"): never {
  throw new Error(`${message} ${String(x)}`);
}
