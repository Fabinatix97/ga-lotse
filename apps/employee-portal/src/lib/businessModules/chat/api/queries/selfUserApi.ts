/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { selfUserChatAttributesApiQueryKey } from "@/lib/businessModules/chat/api/queries/apiQueryKeys";

export function getSelfUserChatAttributesQueryKey() {
  return selfUserChatAttributesApiQueryKey(["getSelfUserChatAttributes"]);
}

export function useGetSelfUserChatAttributes() {
  const userApi = useUserApi();
  return useQuery({
    queryKey: getSelfUserChatAttributesQueryKey(),
    queryFn: () => userApi.getSelfUserChatAttributes(),
  });
}
