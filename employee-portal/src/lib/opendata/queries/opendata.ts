/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { GetOpenDocumentsRequest } from "@eshg/opendata-api";

import { useOpenDataApi } from "@/lib/opendata/api/clients";
import { mapToOpenDataRow } from "@/lib/opendata/components/openDataColumns";
import { openDataApiQueryKey } from "@/lib/opendata/queries/queryKeys";

export function useGetOpenDocuments(request: GetOpenDocumentsRequest) {
  const openDataApi = useOpenDataApi();

  return useSuspenseQuery({
    queryKey: openDataApiQueryKey(["getOpenDocumentsRaw", request]),
    queryFn: () =>
      openDataApi
        .getOpenDocumentsRaw(request)
        .then(unwrapRawResponse)
        .then(({ elements, totalElements, totalPages }) => ({
          elements: elements.map(mapToOpenDataRow),
          totalElements,
          totalPages,
        })),
  });
}

export function useGetVersion(versionId: string) {
  const openDataApi = useOpenDataApi();

  return useSuspenseQuery({
    queryKey: openDataApiQueryKey(["getVersion", versionId]),
    queryFn: () => openDataApi.getVersion(versionId),
  });
}

export function useGetFallbackLicenseUrl() {
  const openDataApi = useOpenDataApi();

  return useSuspenseQuery({
    queryKey: openDataApiQueryKey(["getFallbackLicenseUrl"]),
    queryFn: () => openDataApi.getFallbackLicenseUrl(),
    select: (response) => response.fallbackLicenseUrl,
  });
}
