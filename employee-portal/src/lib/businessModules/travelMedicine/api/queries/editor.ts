/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiSortDirection,
  ApiTextBlockSortKey,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  useEditorApi,
  useTextBlockApi,
} from "@/lib/businessModules/travelMedicine/api/clients";
import { editorApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useLoadEditor(reportId: string) {
  const editorApi = useEditorApi();
  return useSuspenseQuery({
    queryKey: editorApiQueryKey(["loadEditor", { reportId }]),
    queryFn: () => editorApi.loadEditor(reportId),
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
