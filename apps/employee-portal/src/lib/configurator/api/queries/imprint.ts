/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { ApiGetMarkdownInfoResponseMultiLangDocument } from "@eshg/base-api";

import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetImprintMarkdownQuery() {
  const markdownConfigApi = useDepartmentConfigurationApi();

  return queryOptions({
    queryKey: configuratorApiQueryKey([
      "BASE",
      markdownConfigApi,
      "getImprintInfo",
    ]),
    queryFn: () => {
      return markdownConfigApi.getImprintInfo();
    },
    select: ({ markdownInfo }: ApiGetMarkdownInfoResponseMultiLangDocument) =>
      markdownInfo,
  });
}

export function useGetImprintMarkdown() {
  const getImprintQuery = useGetImprintMarkdownQuery();

  return useSuspenseQuery(getImprintQuery);
}
