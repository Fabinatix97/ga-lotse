/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetMetaDataHistoryResponse } from "@eshg/employee-portal-api/businessProcedures";
import { ApiGetMetaDataHistoryResponseMetaDataHistoryInner } from "@eshg/employee-portal-api/schoolEntry";
import { type QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined, reverse } from "remeda";

import { HistoryItem } from "@/lib/shared/components/procedures/progress-entries/types";

export function useGetMetaDataHistoryTemplate(
  useFileApi: () => {
    getMetaDataHistory: (
      fileId: string,
    ) => Promise<ApiGetMetaDataHistoryResponse>;
  },
  queryKeyFactory: QueryKeyFactory,
  fileId: string,
) {
  const fileApi = useFileApi();
  return useSuspenseQuery({
    queryKey: queryKeyFactory(["getMetaDataHistory", fileId]),
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
