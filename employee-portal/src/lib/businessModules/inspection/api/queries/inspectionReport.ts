/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiSortDirection,
  ApiTextBlockSortKey,
  EditorApi,
  InspectionApi,
  TextBlockApi,
} from "@eshg/employee-portal-api/inspection";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  useEditorApi,
  useInspectionApi,
} from "@/lib/businessModules/inspection/api/clients";
import { editorApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { useGetHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/useGetHeadersForOfflineCaching";

export function loadEditorQuery(
  editorApi: EditorApi,
  getPreCacheForOfflineModeHeaders: (inspectionId?: string) => RequestInit,
  reportId: string,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: editorApiQueryKey(["loadEditor", { reportId, inspectionId }]),
    queryFn: () =>
      editorApi.loadEditor(
        reportId,
        getPreCacheForOfflineModeHeaders(inspectionId),
      ),
  });
}

export function useGetInspectionAndLoadEditor(inspectionId: string) {
  const inspectionApi = useInspectionApi();
  const editorApi = useEditorApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery(
    getInspectionAndLoadEditorQuery(
      inspectionApi,
      editorApi,
      getPreCacheForOfflineModeHeaders,
      inspectionId,
    ),
  );
}

export function getInspectionAndLoadEditorQuery(
  inspectionApi: InspectionApi,
  editorApi: EditorApi,
  getPreCacheForOfflineModeHeaders: (inspectionId?: string) => RequestInit,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: editorApiQueryKey([
      "getInspectionAndLoadEditor",
      { inspectionId },
    ]),
    queryFn: async () => {
      const inspection = await inspectionApi.getInspection(
        inspectionId,
        getPreCacheForOfflineModeHeaders(inspectionId),
      );

      const editorData = await editorApi.loadEditor(
        inspection.reportId!,
        getPreCacheForOfflineModeHeaders(inspectionId),
      );

      return { inspection, editorData };
    },
  });
}

export function getTextBlocksQuery(textBlockApi: TextBlockApi) {
  return queryOptions({
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
