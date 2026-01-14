/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RequiresChildren } from "@eshg/lib-portal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0, // disable query caching
      retry: 3,
      throwOnError: true,
    },
    mutations: {
      throwOnError: false,
    },
  },
});

export function ApiProvider(props: Readonly<RequiresChildren>) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
