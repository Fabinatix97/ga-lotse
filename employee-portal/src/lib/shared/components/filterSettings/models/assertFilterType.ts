/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

export function assertFilterType<TValueType extends FilterValue["type"]>(
  value: FilterValue,
  type: TValueType,
): asserts value is Extract<FilterValue, { type: TValueType }> {
  if (value.type !== type) {
    throw new Error(`Expected type ${type}, but got ${value.type}`);
  }
}
