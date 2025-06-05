/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterValue } from "@eshg/lib-employee-portal";

export function assertFilterType<TValueType extends FilterValue["type"]>(
  value: FilterValue,
  type: TValueType,
): asserts value is Extract<FilterValue, { type: TValueType }> {
  if (value.type !== type) {
    throw new Error(`Expected type ${type}, but got ${value.type}`);
  }
}
