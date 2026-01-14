/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function safeIntOrUndefined(num: number): number | undefined {
  return Number.isSafeInteger(num) ? num : undefined;
}
