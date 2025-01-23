/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetOpenDocuments1Request } from "@eshg/citizen-portal-api/openData";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useOpenDataPublicCitizenApi } from "@/lib/businessModules/opendata/api/clients";
import { publicCitizenApiQueryKey } from "@/lib/businessModules/opendata/api/queries/apiQueryKeys";

export function useGetOpenDocuments(request: GetOpenDocuments1Request) {
  const openDataApi = useOpenDataPublicCitizenApi();

  return useSuspenseQuery({
    queryKey: publicCitizenApiQueryKey(["getOpenDocuments1Raw", request]),
    queryFn: () =>
      openDataApi.getOpenDocuments1Raw(request).then(unwrapRawResponse),
  });
}

export function useGetVersion(versionId: string) {
  const openDataApi = useOpenDataPublicCitizenApi();

  return useSuspenseQuery({
    queryKey: publicCitizenApiQueryKey(["getVersion", versionId]),
    queryFn: () => openDataApi.getVersion1(versionId),
  });
}
