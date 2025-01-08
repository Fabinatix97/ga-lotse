/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UserApi } from "@eshg/employee-portal-api/base";
import { queryOptions } from "@tanstack/react-query";

import { userApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function getAllAssignableUsersQuery(userApi: UserApi) {
  return queryOptions({
    queryKey: userApiQueryKey(["getAllAssignableUsers"]),
    queryFn: () => userApi.getUsersByGroup("[System] Begehung"),
    select: (response) => response.users ?? [],
  });
}

export function getSelfUserQuery(userApi: UserApi) {
  return queryOptions({
    queryKey: userApiQueryKey(["getSelfUser"]),
    queryFn: () => userApi.getSelfUser(),
    select: (response) => response,
  });
}
