/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { QueryClient, queryOptions } from "@tanstack/react-query";

import { DiseaseApi } from "@eshg/travel-medicine-api";

import { useDiseaseApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { diseaseApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllDiseasesQuery() {
  const diseaseApi = useDiseaseApi();
  return queryOptions({
    queryKey: diseaseApiQueryKey(["getDiseases"]),
    queryFn: () => diseaseApi.getDiseases(),
    select: (response) => response.diseases ?? [],
  });
}

export function getAllDiseasesInUse(
  queryClient: QueryClient,
  diseaseApi: DiseaseApi,
  diseaseId: string,
) {
  return queryClient.fetchQuery({
    queryKey: diseaseApiQueryKey(["getDiseaseInUse", diseaseId]),
    queryFn: () => diseaseApi.getDiseaseInUse(diseaseId),
  });
}
