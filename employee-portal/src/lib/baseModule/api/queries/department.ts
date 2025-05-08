/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { ApiEmployeePortalMarkdownName, DepartmentApi } from "@eshg/base-api";

import { useDepartmentApi } from "@/lib/baseModule/api/clients";
import { departmentApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetEmployeePortalMarkdown(
  name: ApiEmployeePortalMarkdownName,
) {
  const departmentApi = useDepartmentApi();
  return useSuspenseQuery(getEmployeePortalMarkdownQuery(departmentApi, name));
}

function getEmployeePortalMarkdownQuery(
  departmentApi: DepartmentApi,
  name: ApiEmployeePortalMarkdownName,
) {
  return queryOptions({
    queryKey: departmentApiQueryKey(["getEmployeePortalMarkdown", name]),
    queryFn: () => departmentApi.getEmployeePortalMarkdown(name),
  });
}

export function useGetReleaseNotesMarkdown() {
  const departmentApi = useDepartmentApi();
  return useSuspenseQuery(getReleaseNotesMarkdownQuery(departmentApi));
}

function getReleaseNotesMarkdownQuery(departmentApi: DepartmentApi) {
  return queryOptions({
    queryKey: departmentApiQueryKey(["getReleaseNotesMarkdown"]),
    queryFn: () => departmentApi.getReleaseNotesMarkdown(),
  });
}
