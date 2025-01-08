/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChecklistApi } from "@eshg/employee-portal-api/inspection";
import { queryOptions } from "@tanstack/react-query";

import { checklistApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";

export function getChecklistsQueryKey(inspectionId: string) {
  return checklistApiQueryKey(["getChecklists", { inspectionId }]);
}

export function getChecklistsQuery(
  checklistApi: ChecklistApi,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: getChecklistsQueryKey(inspectionId),
    queryFn: ({ signal }) => {
      return checklistApi.getChecklists(inspectionId, {
        ...getHeadersForOfflineCaching(inspectionId),
        signal,
      });
    },
    select: (response) => response.checklists,
  });
}
