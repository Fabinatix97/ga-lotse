/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiSelfUser } from "@eshg/base-api";
import { useSuspenseQuery } from "@tanstack/react-query";

import { userApiQueryKey } from "@/config/apiQueryKeys";
import { useApi } from "@/contexts/api";

function useGetSelfUserAndAccess<T>(select: (selfUser: ApiSelfUser) => T) {
  const { userApi } = useApi();
  return useSuspenseQuery({
    queryKey: userApiQueryKey(["getSelfUserAndAccess"]),
    queryFn: () => userApi.getSelfUserAndAccess(),
    staleTime: 60_000,
    select,
  });
}

export function useGetSelfUser() {
  return useGetSelfUserAndAccess((selfUser) => selfUser.user);
}

export function useGetSelfUserPermissions() {
  return useGetSelfUserAndAccess((selfUser) => selfUser.roles);
}
