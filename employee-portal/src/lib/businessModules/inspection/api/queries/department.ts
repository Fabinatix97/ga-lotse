/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useDepartmentApi } from "@/lib/baseModule/api/clients";
import { departmentApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { useGetHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/useGetHeadersForOfflineCaching";

export function getDepartmentQueryKey() {
  return departmentApiQueryKey(["getDepartment"]);
}

export function useGetDepartment() {
  const departmentApi = useDepartmentApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery({
    queryKey: getDepartmentQueryKey(),
    queryFn: () =>
      departmentApi.getDepartmentInfo(getPreCacheForOfflineModeHeaders()),
  });
}
