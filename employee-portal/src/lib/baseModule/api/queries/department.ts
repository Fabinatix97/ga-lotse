/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiEmployeePortalMarkdownName,
  EmployeeDepartmentApi,
} from "@eshg/base-api";

import { useEmployeeDepartmentApi } from "@/lib/baseModule/api/clients";
import { departmentApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetEmployeePortalMarkdown(
  name: ApiEmployeePortalMarkdownName,
) {
  const departmentApi = useEmployeeDepartmentApi();
  return useSuspenseQuery(getEmployeePortalMarkdownQuery(departmentApi, name));
}

function getEmployeePortalMarkdownQuery(
  departmentApi: EmployeeDepartmentApi,
  name: ApiEmployeePortalMarkdownName,
) {
  return queryOptions({
    queryKey: departmentApiQueryKey(["getEmployeePortalMarkdown", name]),
    queryFn: () => departmentApi.getEmployeePortalMarkdown(name),
  });
}

export function useGetReleaseNotesMarkdown() {
  const departmentApi = useEmployeeDepartmentApi();
  return useSuspenseQuery(getReleaseNotesMarkdownQuery(departmentApi));
}

function getReleaseNotesMarkdownQuery(departmentApi: EmployeeDepartmentApi) {
  return queryOptions({
    queryKey: departmentApiQueryKey(["getReleaseNotesMarkdown"]),
    queryFn: () => departmentApi.getReleaseNotesMarkdown(),
  });
}
