/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryOptions } from "@tanstack/react-query";

import { ApiGetUsersResponse, ApiUser } from "@eshg/base-api";

import { userApiQueryKey } from "../../config/apiQueryKeys";
import { useApi } from "../../contexts/api";

export function useGetUsersByGroupQuery(
  groupName: string,
  initOverrides?: RequestInit,
) {
  const { userApi } = useApi();

  return queryOptions({
    queryKey: userApiQueryKey(["getUsersByGroup", groupName, initOverrides]),
    queryFn: () => userApi.getUsersByGroup(groupName, initOverrides),
    select: mapUsers,
  });
}

function mapUsers(response: ApiGetUsersResponse): ApiUser[] {
  return response.users;
}
