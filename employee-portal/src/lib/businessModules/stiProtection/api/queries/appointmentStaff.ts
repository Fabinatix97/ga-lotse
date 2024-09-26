/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetUsersResponse,
  ApiUser,
  UserApi,
} from "@eshg/employee-portal-api/base";
import { queryOptions } from "@tanstack/react-query";

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
