/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiSortDirection,
  ApiTextBlockSortKey,
} from "@eshg/employee-portal-api/inspection";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  useEditorApi,
  useTextBlockApi,
} from "@/lib/businessModules/inspection/api/clients";
import { editorApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { useGetHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/useGetHeadersForOfflineCaching";

export function useLoadEditor(reportId: string, inspectionId: string) {
  const editorApi = useEditorApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery({
    queryKey: editorApiQueryKey(["loadEditor", { reportId, inspectionId }]),
    queryFn: () =>
      editorApi.loadEditor(
        reportId,
        getPreCacheForOfflineModeHeaders(inspectionId),
      ),
  });
}

export function useGetTextBlocks() {
  const textBlockApi = useTextBlockApi();
  return useSuspenseQuery({
    queryKey: editorApiQueryKey(["getTextBlocksTemplate"]),
    queryFn: () =>
      textBlockApi.getTextBlocks(
        undefined,
        ApiTextBlockSortKey.Name,
        ApiSortDirection.Asc,
        0,
        1000,
      ),
    select: (response) => response.elements,
  });
}
