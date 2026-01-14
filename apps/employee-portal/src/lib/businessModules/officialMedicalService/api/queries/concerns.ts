/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useConcernApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { concernApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function useGetAllConcernsQuery() {
  const concernApi = useConcernApi();
  return queryOptions({
    queryKey: concernApiQueryKey(["getAllConcerns"]),
    queryFn: () => concernApi.getAllConcerns(),
  });
}
