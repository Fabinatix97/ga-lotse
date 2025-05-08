/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

function* createChunkedArrays<T>(
  arr: T[],
  chunkSize: number,
): Generator<T[], void> {
  if (chunkSize < 1) throw new Error(`invalid chunkSize: ${chunkSize}`);
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}

export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  return [...createChunkedArrays(arr, chunkSize)];
}
