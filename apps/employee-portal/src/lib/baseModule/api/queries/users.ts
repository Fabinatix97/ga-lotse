/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { GetSelfEventsRequest } from "@eshg/base-api";
import {
  PortalErrorCode,
  resolveError,
  unwrapRawResponse,
} from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { userApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";
import { sortUsersByName } from "@/lib/shared/helpers/users";

export function useGetUserProfile(id: string) {
  const usersApi = useUserApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getUserProfile", id]),
    queryFn: () => usersApi.getUserProfile(id),
  });
}

export function useGetUserOverviewPageQuery() {
  const userApi = useUserApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getUserManagementPage"]),
    queryFn: () => userApi.getUserManagementPage(),
    select: (response) => ({
      selfGroups: response.selfGroups.map((group) => group.name),
      users: response.groupMembers
        .map((member) => member.user)
        .sort(sortUsersByName),
    }),
  });
}

export function useGetSelfGroupsQueryOptions() {
  const userApi = useUserApi();
  return queryOptions({
    queryKey: userApiQueryKey(["getSelfGroups"]),
    queryFn: () => userApi.getSelfGroups(),
    staleTime: 60_000,
  });
}

export function useGetSelfLeadersQueryOptions() {
  const userApi = useUserApi();
  return queryOptions({
    queryKey: userApiQueryKey(["getSelfTeamLeaders"]),
    queryFn: () => userApi.getSelfLeaders(),
    staleTime: 60_000,
  });
}

export function useGetEmployeePrivateUserKey() {
  const userApi = useUserApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getEmployeePrivateUserKey"]),
    queryFn: async () => {
      try {
        return await userApi
          .getEmployeePrivateUserKeyRaw()
          .then(unwrapRawResponse)
          .then((value) => value.encryptedPrivateKey);
      } catch (error) {
        const portalError = resolveError(error);
        if (portalError.errorCode === PortalErrorCode.NotFound) {
          return portalError;
        }

        throw error;
      }
    },
    staleTime: 60_000,
  });
}

export function useGetSelfActiveSessions() {
  const userApi = useUserApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getSelfActiveSessions"]),
    queryFn: () => userApi.getSelfActiveSessions(),
  });
}

export function useGetSelfUserEvents(request: GetSelfEventsRequest) {
  const userApi = useUserApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getSelfUserEvents", request]),
    queryFn: () => userApi.getSelfEventsRaw(request).then(unwrapRawResponse),
  });
}
