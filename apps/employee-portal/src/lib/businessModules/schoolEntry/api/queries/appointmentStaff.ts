/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { ApiGetUsersResponse, ApiUser, UserApi } from "@eshg/base-api";

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
    queryKey: appointmentStaffApiQueryKey(["getAllMedicalAssistants"]),
    queryFn: () => userApi.getUsersByGroup("[System] ESU-MFA"),
    select: mapUsers,
  });
}

export function getAllSopassQualifiedMFAsQuery(userApi: UserApi) {
  return queryOptions({
    queryKey: appointmentStaffApiQueryKey(["getAllSopassQualifiedMFAs"]),
    queryFn: () => userApi.getUsersByGroup("[System] ESU-SOPASS"),
    select: mapUsers,
  });
}

function mapUsers(response: ApiGetUsersResponse): ApiUser[] {
  return response.users;
}
