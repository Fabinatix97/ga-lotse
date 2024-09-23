/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DepartmentApi } from "@eshg/citizen-portal-api/base";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { useDepartmentApi } from "@/lib/shared/api/clients";
import { mapDepartmentInfo } from "@/lib/shared/api/models/DepartmentInfo";
import { departmentApiQueryKey } from "@/lib/shared/api/queries/apiQueryKeys";

export function useGetDepartmentInfo() {
  const departmentApi = useDepartmentApi();
  return useSuspenseQuery(getDepartmentInfoQuery(departmentApi));
}

export function getDepartmentInfoQuery(departmentApi: DepartmentApi) {
  return queryOptions({
    queryKey: departmentApiQueryKey(["getDepartmentInfo"]),
    queryFn: () => departmentApi.getDepartmentInfo(),
    select: mapDepartmentInfo,
  });
}

export function useGetDepartmentLogo() {
  const departmentApi = useDepartmentApi();
  return useQuery({
    queryKey: departmentApiQueryKey(["getDepartmentLogo"]),
    queryFn: () => departmentApi.getDepartmentLogo().then(URL.createObjectURL),
    throwOnError: false,
  });
}
