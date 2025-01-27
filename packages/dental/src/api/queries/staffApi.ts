/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetUsersResponse, ApiUser, UserApi } from "@eshg/base-api";
import { queryOptions } from "@tanstack/react-query";

import { staffApiQueryKey } from "./apiQueryKeys";

export function getAllDentistsQuery(userApi: UserApi) {
  return queryOptions({
    queryKey: staffApiQueryKey(["getAllDentists"]),
    queryFn: () => userApi.getUsersByGroup("[System] Zahnarzt"),
    select: mapUsers,
  });
}

export function getAllDentalAssistantsQuery(userApi: UserApi) {
  return queryOptions({
    queryKey: staffApiQueryKey(["getAllDentalAssistants"]),
    queryFn: () => userApi.getUsersByGroup("[System] ZFA"),
    select: mapUsers,
  });
}

function mapUsers(response: ApiGetUsersResponse): ApiUser[] {
  return response.users;
}
