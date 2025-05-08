/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  keepPreviousData,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { ApiTextTemplateContext } from "@eshg/sti-protection-api";

import { useTextTemplateApi } from "@/lib/businessModules/stiProtection/api/clients";
import { textTemplateApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

function useTextTemplatesQuery(contexts?: ApiTextTemplateContext[]) {
  const textTemplateApi = useTextTemplateApi();
  return queryOptions({
    queryKey: textTemplateApiQueryKey(["list", ...(contexts ?? [])]),
    queryFn: () => textTemplateApi.getTextTemplates(new Set(contexts)),
    select: (response) => response.textTemplates,
    placeholderData: keepPreviousData,
  });
}

export function useTextTemplates(contexts?: ApiTextTemplateContext[]) {
  return useSuspenseQuery(useTextTemplatesQuery(contexts));
}
