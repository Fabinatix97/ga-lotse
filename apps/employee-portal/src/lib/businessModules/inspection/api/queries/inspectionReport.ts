/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiSortDirection,
  ApiTextBlockSortKey,
  EditorApi,
  InspectionApi,
  TextBlockApi,
} from "@eshg/inspection-api";

import {
  useEditorApi,
  useInspectionApi,
} from "@/lib/businessModules/inspection/api/clients";
import { editorApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";

export function loadEditorQuery(
  editorApi: EditorApi,
  reportId: string,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: editorApiQueryKey(["loadEditor", { reportId, inspectionId }]),
    queryFn: () =>
      editorApi.loadEditor(reportId, getHeadersForOfflineCaching(inspectionId)),
  });
}

export function useGetInspectionAndLoadEditor(inspectionId: string) {
  const inspectionApi = useInspectionApi();
  const editorApi = useEditorApi();
  return useSuspenseQuery(
    getInspectionAndLoadEditorQuery(inspectionApi, editorApi, inspectionId),
  );
}

function getInspectionAndLoadEditorQuery(
  inspectionApi: InspectionApi,
  editorApi: EditorApi,
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
        getHeadersForOfflineCaching(inspectionId),
      );

      const editorData = await editorApi.loadEditor(
        inspection.reportId!,
        getHeadersForOfflineCaching(inspectionId),
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
