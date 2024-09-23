/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}
