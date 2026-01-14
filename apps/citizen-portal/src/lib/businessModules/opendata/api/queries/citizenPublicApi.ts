/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  InfiniteData,
  queryOptions,
  useInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiGetOpenDocumentsResponse,
  ApiVersion,
  GetOpenDocuments1Request,
  OpenDataPublicCitizenApi,
} from "@eshg/opendata-api";

import { useOpenDataPublicCitizenApi } from "@/lib/businessModules/opendata/api/clients";
import { publicCitizenApiQueryKey } from "@/lib/businessModules/opendata/api/queries/apiQueryKeys";

interface GetOpenDataOverviewResponse {
  versions: ApiVersion[];
  totalElements: number;
  totalPages: number;
}

export function useGetOpenDocuments(
  request: Omit<GetOpenDocuments1Request, "pageNumber">,
) {
  const openDataApi = useOpenDataPublicCitizenApi();

  return useInfiniteQuery({
    queryKey: publicCitizenApiQueryKey(["getOpenDocuments1Raw", request]),
    queryFn: ({ pageParam }) =>
      openDataApi
        .getOpenDocuments1Raw({ ...request, pageNumber: pageParam })
        .then(unwrapRawResponse),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return pages.length < lastPage.totalPages ? pages.length : null;
    },
    select: mapToOpenDataOverview,
  });
}

export function useGetVersion(versionId: string) {
  const openDataApi = useOpenDataPublicCitizenApi();

  return useSuspenseQuery({
    queryKey: publicCitizenApiQueryKey(["getVersion", versionId]),
    queryFn: () => openDataApi.getVersion1(versionId),
  });
}

export function mapToOpenDataOverview(
  data: InfiniteData<ApiGetOpenDocumentsResponse, number>,
) {
  return {
    versions:
      data.pages
        .flatMap((page) => page.elements)
        .flatMap(({ versions }) => versions) ?? [],
    totalElements: data.pages[0]?.totalElements ?? 0,
    totalPages: data.pages[0]?.totalPages ?? 0,
  } satisfies GetOpenDataOverviewResponse;
}

export function useGetTermsOfUse() {
  const openDataApi = useOpenDataPublicCitizenApi();
  return useSuspenseQuery(getTermsOfUseQuery(openDataApi));
}

function getTermsOfUseQuery(openDataApi: OpenDataPublicCitizenApi) {
  return queryOptions({
    queryKey: publicCitizenApiQueryKey(["getTermsOfUse"]),
    queryFn: () => openDataApi.getTermsOfUse(),
  });
}
