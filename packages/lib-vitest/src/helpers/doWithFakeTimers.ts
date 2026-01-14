/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi } from "vitest";

export function doWithFakeTimers<TResult = unknown>(
  date: string | Date,
  action: () => TResult,
) {
  vi.useFakeTimers();
  vi.setSystemTime(date);
  const result = action();
  vi.useRealTimers();
  return result;
}
