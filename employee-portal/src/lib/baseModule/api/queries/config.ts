/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useConfigApi } from "@/lib/baseModule/api/clients";

import { configApiQueryKey } from "./apiQueryKey";

export function useServerConfig() {
  const configApi = useConfigApi();
  return useSuspenseQuery({
    queryKey: configApiQueryKey(["getConfig"]),
    queryFn: () => configApi.getConfigRaw().then(unwrapRawResponse),
    select: (response) => response,
    // refresh only every 24h; config rarely changes
    staleTime: 86400_000,
  });
}
