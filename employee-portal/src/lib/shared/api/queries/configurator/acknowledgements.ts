/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { ApiGetMarkdownInfoResponseInternationalMarkdownInfo } from "@eshg/base-api";

import { useMarkdownConfigurationApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetAcknowledgementsMarkdownQuery() {
  const markdownConfigApi = useMarkdownConfigurationApi();

  return queryOptions({
    queryKey: configuratorApiQueryKey([
      "BASE",
      markdownConfigApi,
      "getAcknowledgementsInfo",
    ]),
    queryFn: () => {
      return markdownConfigApi.getAcknowledgementsInfo();
    },
    select: ({
      markdownInfo,
    }: ApiGetMarkdownInfoResponseInternationalMarkdownInfo) => markdownInfo,
  });
}

export function useGetAcknowledgementsMarkdown() {
  const getAcknowledgementsQuery = useGetAcknowledgementsMarkdownQuery();

  return useSuspenseQuery(getAcknowledgementsQuery);
}
