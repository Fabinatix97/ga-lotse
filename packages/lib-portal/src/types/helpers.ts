/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export type EnumMap<TEnum extends string, TValue = string> = Record<
  TEnum,
  TValue
>;
