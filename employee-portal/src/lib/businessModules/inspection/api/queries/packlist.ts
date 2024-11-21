/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { usePacklistApi } from "@/lib/businessModules/inspection/api/clients";
import { packlistApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";

export function getPacklistsQueryKey(inspectionId: string) {
  return packlistApiQueryKey(["getPacklists", { inspectionId }]);
}

export function useGetPacklists(inspectionId: string) {
  const packlistApi = usePacklistApi();
  return useSuspenseQuery({
    queryKey: getPacklistsQueryKey(inspectionId),
    queryFn: ({ signal }) =>
      packlistApi.getPacklists(inspectionId, {
        ...getHeadersForOfflineCaching(inspectionId),
        signal,
      }),
    select: (response) => response.packlists,
  });
}
