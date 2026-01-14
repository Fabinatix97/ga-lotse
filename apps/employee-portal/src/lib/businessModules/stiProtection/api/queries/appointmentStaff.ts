/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { ApiGetUsersResponse, ApiUser, UserApi } from "@eshg/base-api";

import { appointmentStaffApiQueryKey } from "./apiQueryKeys";

export function getAllPhysiciansQuery(userApi: UserApi) {
  return queryOptions({
    queryKey: appointmentStaffApiQueryKey(["physicians"]),
    queryFn: () => userApi.getUsersByGroup("[System] HIV-STI-Arzt"),
    select: mapUsers,
  });
}

export function getAllConsultantsQuery(userApi: UserApi) {
  return queryOptions({
    queryKey: appointmentStaffApiQueryKey(["consultants"]),
    queryFn: () => userApi.getUsersByGroup("[System] HIV-STI-Berater"),
    select: mapUsers,
  });
}

function mapUsers(response: ApiGetUsersResponse): ApiUser[] {
  return response.users;
}
