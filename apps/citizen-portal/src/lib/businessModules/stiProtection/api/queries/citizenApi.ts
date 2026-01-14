/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useFileDownload } from "@eshg/lib-portal";

import { useCitizenApi } from "@/lib/businessModules/stiProtection/api/clients";

import { stiProtectionCitizenApiQueryKey } from "./apiQueryKeys";

function useGetProcedureQuery() {
  const citizenApi = useCitizenApi();
  return queryOptions({
    queryKey: stiProtectionCitizenApiQueryKey(["procedure"]),
    queryFn: () => citizenApi.getCitizenProcedure(),
  });
}

export function useGetProcedure() {
  return useSuspenseQuery(useGetProcedureQuery());
}

export function useAnonymousIdentificationDocumentQuery() {
  const citizenApi = useCitizenApi();
  return useFileDownload(() =>
    citizenApi.getCitizenAnonymousIdentificationDocumentRaw(),
  );
}
