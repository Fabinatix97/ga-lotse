/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";

import { useDepartmentApi } from "@/lib/baseModule/api/clients";
import { departmentApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function getDepartmentQueryKey() {
  return departmentApiQueryKey(["getDepartment"]);
}

export function useGetDepartment() {
  const departmentApi = useDepartmentApi();
  return useSuspenseQuery({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: getDepartmentQueryKey(),
    queryFn: () => departmentApi.getDepartmentInfo(),
  });
}
