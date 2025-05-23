/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  ApiCitizenPortalMarkdownName,
  PublicDepartmentApi,
} from "@eshg/base-api";
import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";

import { usePublicDepartmentApi } from "@/lib/shared/api/clients";
import { mapDepartmentInfo } from "@/lib/shared/api/models/DepartmentInfo";
import { departmentApiQueryKey } from "@/lib/shared/api/queries/apiQueryKeys";

export function useGetDepartmentInfo() {
  const departmentApi = usePublicDepartmentApi();
  return useSuspenseQuery(getDepartmentInfoQuery(departmentApi));
}

export function getDepartmentInfoQuery(departmentApi: PublicDepartmentApi) {
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: departmentApiQueryKey(["getDepartmentInfo"]),
    queryFn: () => departmentApi.getDepartmentInfo(),
    select: mapDepartmentInfo,
  });
}

export function useGetDepartmentLogo() {
  const departmentApi = usePublicDepartmentApi();
  return useQuery({
    queryKey: departmentApiQueryKey(["getDepartmentLogo"]),
    queryFn: () => departmentApi.getDepartmentLogo().then(URL.createObjectURL),
    throwOnError: false,
  });
}

export function useGetCitizenPortalMarkdown(
  name: ApiCitizenPortalMarkdownName,
) {
  const departmentApi = usePublicDepartmentApi();
  return useSuspenseQuery(getCitizenPortalMarkdownQuery(departmentApi, name));
}

function getCitizenPortalMarkdownQuery(
  departmentApi: PublicDepartmentApi,
  name: ApiCitizenPortalMarkdownName,
) {
  return queryOptions({
    queryKey: departmentApiQueryKey(["getCitizenPortalMarkdown", name]),
    queryFn: () => departmentApi.getCitizenPortalMarkdown(name),
  });
}
