/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { SearchRequest } from "@eshg/inspection-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";

import { useWebSearchApi } from "@/lib/businessModules/inspection/api/clients";
import { webSearchApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { FacilityWebSearchFiltersSchema } from "@/lib/businessModules/inspection/shared/types";

export function useGetWebSearchOverview() {
  const webSearchApi = useWebSearchApi();
  return useSuspenseQuery({
    queryKey: webSearchApiQueryKey(["getWebSearchOverview"]),
    queryFn: () => webSearchApi.getWebSearchOverview(),
    select: (response) => response.entries,
  });
}

export function useGetWebSearchById(id: string) {
  const webSearchApi = useWebSearchApi();
  return useSuspenseQuery({
    queryKey: webSearchApiQueryKey(["getWebSearchById", { id }]),
    queryFn: () => webSearchApi.getWebSearchById(id),
  });
}

export function useSearchInWebSearch(
  id: string,
  filters: FacilityWebSearchFiltersSchema = {},
) {
  const webSearchApi = useWebSearchApi();

  const { sortDirection, sortField, ...restFilters } = filters;
  const direction = sortDirection?.toUpperCase() ?? "ASC";
  const sort = sortField ? [`${sortField}|${direction}`] : undefined;
  const req: SearchRequest = { id, sort, ...restFilters };

  return useSuspenseQuery({
    queryKey: webSearchApiQueryKey(["searchInWebSearch", { req }]),
    queryFn: () => webSearchApi.searchRaw(req).then(unwrapRawResponse),
  });
}
