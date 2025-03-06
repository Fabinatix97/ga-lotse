/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useCitizenApi } from "@/lib/businessModules/stiProtection/api/clients";

import { stiProtectionCitizenApiQueryKey } from "./apiQueryKeys";

export function useGetProcedureQuery() {
  const citizenApi = useCitizenApi();
  return queryOptions({
    queryKey: stiProtectionCitizenApiQueryKey(["procedure"]),
    queryFn: () => citizenApi.getCitizenProcedure(),
  });
}

export function useGetProcedure() {
  return useSuspenseQuery(useGetProcedureQuery());
}
