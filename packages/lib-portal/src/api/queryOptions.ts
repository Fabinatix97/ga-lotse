/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { UseQueryOptions } from "@tanstack/react-query";

const DURATION_1DAY = 86_400_000; // in ms
const DURATION_1HOUR = 3_600_000; // in ms

/**
 * Marks a query as a configuration query, enabling long-time caching
 */
export const STATIC_QUERY_OPTIONS = {
  gcTime: DURATION_1DAY,
  staleTime: DURATION_1DAY,
  meta: {
    static: true,
  },
} as const satisfies Partial<UseQueryOptions>;

/**
 * Marks a query as a configuration query, enabling long-time caching
 */
export const SEMI_STATIC_QUERY_OPTIONS = {
  gcTime: DURATION_1HOUR,
  staleTime: DURATION_1HOUR,
  meta: {
    static: true,
  },
} as const satisfies Partial<UseQueryOptions>;
