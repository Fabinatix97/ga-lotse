/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetUsersResponse, UserApi } from "@eshg/base-api";
import {
  ApiUser,
  GetProphylaxisSessionRequest,
  ProphylaxisSessionApi,
} from "@eshg/dental-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions } from "@tanstack/react-query";

import {
  prophylaxisSessionApiQueryKey,
  staffApiQueryKey,
} from "@/config/apiQueryKeys";
import { mapProphylaxisSessionDetails } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionDetails";

export function getProphylaxisSessionQuery(
  prophylaxisSessionApi: ProphylaxisSessionApi,
  request: GetProphylaxisSessionRequest,
) {
  return queryOptions({
    queryKey: prophylaxisSessionApiQueryKey(["getProphylaxisSession", request]),
    queryFn: () =>
      prophylaxisSessionApi
        .getProphylaxisSessionRaw(request)
        .then(unwrapRawResponse),
    select: mapProphylaxisSessionDetails,
  });
}

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
