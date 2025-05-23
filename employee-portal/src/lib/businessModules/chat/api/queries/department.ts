/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";

import { usePublicDepartmentApi } from "@/lib/baseModule/api/clients";
import { departmentApiQueryKey } from "@/lib/businessModules/chat/api/queries/apiQueryKeys";

function getDepartmentQueryKey() {
  return departmentApiQueryKey(["getDepartment"]);
}

export function useGetDepartment() {
  const departmentApi = usePublicDepartmentApi();
  return useQuery({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: getDepartmentQueryKey(),
    queryFn: () => departmentApi.getDepartmentInfo(),
    throwOnError: false,
  });
}
