/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import { queryOptions } from "@tanstack/react-query";

import { useDiseaseApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { mapDisease } from "@/lib/businessModules/travelMedicine/api/models/Disease";
import { diseaseApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllDiseasesQuery() {
  const diseaseApi = useDiseaseApi();
  return queryOptions({
    queryKey: diseaseApiQueryKey(["getDiseases"]),
    queryFn: () => diseaseApi.getDiseases(),
  });
}

export function useGetAllDiseasesUnsuspended(open: boolean) {
  const diseaseApi = useDiseaseApi();
  return useHandledBackgroundQuery({
    queryKey: diseaseApiQueryKey(["getDiseases"]),
    queryFn: () => diseaseApi.getDiseases(),
    select: (response) => response.diseases.map(mapDisease),
    enabled: open,
    gcTime: 60000,
    staleTime: 60000,
  });
}
