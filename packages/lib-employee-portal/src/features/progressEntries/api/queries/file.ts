/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined, reverse } from "remeda";

import {
  ApiBusinessModule,
  ApiGetMetaDataHistoryResponseMetaDataHistoryInner,
} from "@eshg/lib-procedures-api";

import { fileApiQueryKey } from "../../../../config/apiQueryKeys";
import { FileClient } from "../../types/api";
import { HistoryItem } from "../../types/common";

export function useGetMetaDataHistory(
  fileApi: FileClient,
  businessModule: ApiBusinessModule,
  fileId: string,
) {
  return useSuspenseQuery({
    queryKey: fileApiQueryKey(["getMetaDataHistory", businessModule, fileId]),
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
