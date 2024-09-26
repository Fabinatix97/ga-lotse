/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SchoolEntryConfigApi } from "@eshg/employee-portal-api/schoolEntry";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useConfigApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { configApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

const CACHE_DURATION_1DAY = 86_400_000;

export function useGetLocationSelectionMode() {
  const configApi = useConfigApi();
  const { data: locationSelectionMode } = useSuspenseQuery(
    getLocationSelectionModeQuery(configApi),
  );
  return locationSelectionMode;
}

export function getLocationSelectionModeQuery(configApi: SchoolEntryConfigApi) {
  return queryOptions({
    queryKey: configApiQueryKey(["getConfig"]),
    queryFn: () => configApi.getConfig(),
    select: (response) => response.locationSelectionMode,
    staleTime: CACHE_DURATION_1DAY,
    gcTime: CACHE_DURATION_1DAY,
  });
}
