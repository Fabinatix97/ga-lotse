/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";

import { publicConfigApiQueryKey } from "../../config/apiQueryKeys";
import { useApi } from "../../contexts/api";

export function useGetPublicConfig() {
  const { publicConfigApi } = useApi();

  return useSuspenseQuery({
    ...STATIC_QUERY_OPTIONS,
    queryKey: publicConfigApiQueryKey(["getConfig"]),
    queryFn: () => publicConfigApi.getConfig(),
  });
}
