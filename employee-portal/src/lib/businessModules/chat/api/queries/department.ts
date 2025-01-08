/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { useDepartmentApi } from "@/lib/baseModule/api/clients";
import { departmentApiQueryKey } from "@/lib/businessModules/chat/api/queries/apiQueryKeys";

export function getDepartmentQueryKey() {
  return departmentApiQueryKey(["getDepartment"]);
}

export function useGetDepartment() {
  const departmentApi = useDepartmentApi();
  return useQuery({
    queryKey: getDepartmentQueryKey(),
    queryFn: () => departmentApi.getDepartmentInfo(),
    throwOnError: false,
  });
}
