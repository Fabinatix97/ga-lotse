/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";

import { useConfigApi } from "@/lib/baseModule/api/clients";

import { configApiQueryKey } from "./apiQueryKey";

export function useServerConfig() {
  const configApi = useConfigApi();
  return useSuspenseQuery({
    ...STATIC_QUERY_OPTIONS,
    queryKey: configApiQueryKey(["getConfig"]),
    queryFn: () => configApi.getConfig(),
  });
}
