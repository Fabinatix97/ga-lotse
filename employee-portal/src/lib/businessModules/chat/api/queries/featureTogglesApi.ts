/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChatFeature } from "@eshg/employee-portal-api/chatManagement";
import { useQuery } from "@tanstack/react-query";

import { useFeatureTogglesApi } from "@/lib/businessModules/chat/api/clients";
import { chatFeatureTogglesApiQueryKey } from "@/lib/businessModules/chat/api/queries/apiQueryKeys";

export function useIsNewFeatureEnabled(newFeature: ApiChatFeature) {
  const featureTogglesApi = useFeatureTogglesApi();
  return useQuery({
    queryKey: chatFeatureTogglesApiQueryKey(["getFeatureToggles"]),
    queryFn: () => featureTogglesApi.getFeatureToggles(),
    select: (data) => {
      return data.enabledNewFeatures.has(newFeature);
    },
    throwOnError: false,
  });
}
