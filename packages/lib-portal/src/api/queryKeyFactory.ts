/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryKey } from "@tanstack/react-query";

export function queryKeyFactory<const TBaseQueryKey extends QueryKey>(
  baseQueryKey: TBaseQueryKey,
) {
  return <const TQueryKey extends QueryKey>(queryKey: TQueryKey) =>
    [...baseQueryKey, ...queryKey] as const;
}
export type QueryKeyFactory = ReturnType<typeof queryKeyFactory>;
