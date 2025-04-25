/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined, reverse } from "remeda";

import { QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { ApiGetMetaDataHistoryResponseMetaDataHistoryInner } from "@eshg/school-entry-api";

import {
  FileClient,
  HistoryItem,
} from "@/lib/shared/components/procedures/progress-entries/types";

export function useGetMetaDataHistory(
  fileApi: FileClient,
  queryKey: QueryKeyFactory,
  fileId: string,
) {
  return useSuspenseQuery({
    queryKey: queryKey(["getMetaDataHistory", fileId]),
    queryFn: async () => fileApi.getMetaDataHistory(fileId),
    select: (response) =>
      isDefined(response.metaDataHistory)
        ? reverse(
            response.metaDataHistory?.map((item): HistoryItem => {
              return {
                text: extractFileDescriptionValue(item),
                changedAt: item.changedAt,
              };
            }),
          )
        : undefined,
  });
}

function extractFileDescriptionValue(
  apiHistoryItem: ApiGetMetaDataHistoryResponseMetaDataHistoryInner,
) {
  switch (apiHistoryItem.type) {
    case "ImageMetaDataHistory":
      return apiHistoryItem.imageMetaData?.description;
    case "MailMetaDataHistory":
      return apiHistoryItem.mailMetaData?.description;
    case "PdfMetaDataHistory":
      return apiHistoryItem.pdfMetaData?.description;
  }
}
