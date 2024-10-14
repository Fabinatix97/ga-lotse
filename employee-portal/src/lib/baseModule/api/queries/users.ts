/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetSelfEventsRequest } from "@eshg/employee-portal-api/base";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { PortalErrorCode } from "@eshg/lib-portal/errorHandling/PortalErrorCode";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { userApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";
import { useGetHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/useGetHeadersForOfflineCaching";
import { sortUsersByName } from "@/lib/shared/helpers/users";

export function useGetUserProfile(id: string) {
  const usersApi = useUserApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getUserProfile", id]),
    queryFn: () => usersApi.getUserProfile(id),
  });
}

export function useGetUsersByGroupQuery(
  groupName: string,
  getInitOverrides?: (inspectionId?: string) => RequestInit,
) {
  return useSuspenseQuery(
    useGetUsersByGroupQueryOptions(groupName, getInitOverrides),
  );
}

export function useGetUsersByGroupQueryOptions(
  groupName: string,
  getInitOverrides?: (inspectionId?: string) => RequestInit,
) {
  const usersApi = useUserApi();
  return queryOptions({
    queryKey: userApiQueryKey(["getUsersByGroup", groupName]),
    queryFn: () => usersApi.getUsersByGroup(groupName, getInitOverrides?.()),
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

export function useGetSelfUser() {
  const userApi = useUserApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getSelfUser"]),
    queryFn: () => userApi.getSelfUser(getPreCacheForOfflineModeHeaders()),
    staleTime: 60_000,
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

export function useGetSelfUserPermissions() {
  const userApi = useUserApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getSelfUserPermissions"]),
    queryFn: () =>
      userApi.getSelfUserPermissions(getPreCacheForOfflineModeHeaders()),
    select: (response) => response.permissions,
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
