/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";

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
