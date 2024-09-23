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
    queryKey: appointmentStaffApiQueryKey(["getAllPhysicians"]),
    queryFn: () => userApi.getUsersByGroup("[System] ESU-Arzt"),
    select: mapUsers,
  });
}

export function getAllMedicalAssistantsQuery(userApi: UserApi) {
  return queryOptions({
    queryKey: appointmentStaffApiQueryKey(["getAllMedicalAssistents"]),
    queryFn: () => userApi.getUsersByGroup("[System] ESU-MFA"),
    select: mapUsers,
  });
}

function mapUsers(response: ApiGetUsersResponse): ApiUser[] {
  return response.users;
}
