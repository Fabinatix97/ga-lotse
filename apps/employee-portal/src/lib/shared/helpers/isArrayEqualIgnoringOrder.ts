/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDeepEqual } from "remeda";

export function isArrayEqualIgnoringOrder<T>(arr1: T[], arr2: T[]) {
  const sortedArr1 = arr1.toSorted();
  const sortedArr2 = arr2.toSorted();
  return isDeepEqual(sortedArr1, sortedArr2);
}
