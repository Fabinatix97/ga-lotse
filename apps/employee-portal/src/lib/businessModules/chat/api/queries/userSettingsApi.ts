/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { useUserSettingsApi } from "@/lib/businessModules/chat/api/clients";
import { userSettingsApiQueryKey } from "@/lib/businessModules/chat/api/queries/apiQueryKeys";

export function useGetUserSettings(selfUserId: string, canAccessChat: boolean) {
  const userSettingsApi = useUserSettingsApi();
  return useQuery({
    queryKey: userSettingsApiQueryKey(["getUserSettings", selfUserId]),
    queryFn: () => userSettingsApi.getOrCreateDefaultUserSettings(selfUserId),
    throwOnError: false,
    enabled: !!canAccessChat,
  });
}
