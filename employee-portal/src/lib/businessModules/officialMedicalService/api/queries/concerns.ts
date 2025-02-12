/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConcernApi } from "@eshg/official-medical-service-api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useConcernApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { concernApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function useGetAllConcerns() {
  const concernApi = useConcernApi();
  return useSuspenseQuery(getAllConcernsQuery(concernApi));
}

export function getAllConcernsQuery(concernApi: ConcernApi) {
  return queryOptions({
    queryKey: concernApiQueryKey(["getAllConcerns"]),
    queryFn: () => concernApi.getAllConcerns(),
  });
}
