/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { ApiCitizenPortalMarkdownName, DepartmentApi } from "@eshg/base-api";
import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";

import { useDepartmentApi } from "@/lib/shared/api/clients";
import { mapDepartmentInfo } from "@/lib/shared/api/models/DepartmentInfo";
import { departmentApiQueryKey } from "@/lib/shared/api/queries/apiQueryKeys";

export function useGetDepartmentInfo() {
  const departmentApi = useDepartmentApi();
  return useSuspenseQuery(getDepartmentInfoQuery(departmentApi));
}

export function getDepartmentInfoQuery(departmentApi: DepartmentApi) {
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
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

export function useGetCitizenPortalMarkdown(
  name: ApiCitizenPortalMarkdownName,
) {
  const departmentApi = useDepartmentApi();
  return useSuspenseQuery(getCitizenPortalMarkdownQuery(departmentApi, name));
}

function getCitizenPortalMarkdownQuery(
  departmentApi: DepartmentApi,
  name: ApiCitizenPortalMarkdownName,
) {
  return queryOptions({
    queryKey: departmentApiQueryKey(["getCitizenPortalMarkdown", name]),
    queryFn: () => departmentApi.getCitizenPortalMarkdown(name),
  });
}
