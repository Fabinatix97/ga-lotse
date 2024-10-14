/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useChecklistApi } from "@/lib/businessModules/inspection/api/clients";
import { checklistApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { useGetHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/useGetHeadersForOfflineCaching";

export function getChecklistsQueryKey(inspectionId: string) {
  return checklistApiQueryKey(["getChecklists", { inspectionId }]);
}

export function useGetChecklists(inspectionId: string) {
  const checklistApi = useChecklistApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery({
    queryKey: getChecklistsQueryKey(inspectionId),
    queryFn: ({ signal }) => {
      return checklistApi.getChecklists(inspectionId, {
        ...getPreCacheForOfflineModeHeaders(inspectionId),
        signal,
      });
    },
    select: (response) => response.checklists,
  });
}
