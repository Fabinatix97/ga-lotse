/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";

import { usePublicConfigApi } from "@/lib/shared/api/clients";
import { publicConfigApiQueryKey } from "@/lib/shared/api/queries/apiQueryKeys";

export function useGetConfig() {
  const publicConfigApi = usePublicConfigApi();
  return useSuspenseQuery({
    ...STATIC_QUERY_OPTIONS,
    queryKey: publicConfigApiQueryKey(["getConfig"]),
    queryFn: () => publicConfigApi.getConfig(),
  });
}
