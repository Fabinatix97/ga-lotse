/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { userApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useGetAllAssignableUsers() {
  const userApi = useUserApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["useGetAllAssignableUsers"]),
    queryFn: () => userApi.getUsersByGroup("[System] Begehung"),
    select: (response) => response.users ?? [],
  });
}

export function useGetSelfUser() {
  const userApi = useUserApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["useGetSelfUser"]),
    queryFn: () => userApi.getSelfUser(),
    select: (response) => response,
  });
}
