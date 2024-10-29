/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

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
