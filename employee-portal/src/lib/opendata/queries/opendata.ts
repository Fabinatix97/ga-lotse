/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetOpenDocumentsRequest } from "@eshg/employee-portal-api/opendata";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

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
        .then(({ elements }) => elements.map(mapToOpenDataRow)),
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
