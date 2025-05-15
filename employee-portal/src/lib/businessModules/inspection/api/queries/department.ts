/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { PublicDepartmentApi } from "@eshg/base-api";
import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";

import { departmentApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function getDepartmentQueryKey() {
  return departmentApiQueryKey(["getDepartment"]);
}

export function getDepartmentQuery(departmentApi: PublicDepartmentApi) {
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: getDepartmentQueryKey(),
    queryFn: () => departmentApi.getDepartmentInfo(),
  });
}
