/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { ChildApi, GetChildrenRequest } from "@eshg/dental-api";
import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { isBlankString } from "@eshg/lib-portal/helpers/guards";

import { childApiQueryKey } from "@/config/apiQueryKeys";
import { useDentalApi } from "@/contexts/dental";
import { mapChild } from "@/features/children/api/models/Child";
import { mapChildSearchResult } from "@/features/children/api/models/ChildSearchResult";

export function useGetChildrenQuery(request: GetChildrenRequest) {
  const { childApi } = useDentalApi();

  return queryOptions({
    queryKey: childApiQueryKey(["getChildren", request]),
    queryFn: () => childApi.getChildrenRaw(request).then(unwrapRawResponse),
    select: mapPaginatedList(mapChild),
  });
}

export function useSearchChildren(institutionId: string, searchString: string) {
  const { childApi } = useDentalApi();
  const enabled = !isBlankString(institutionId) && searchString.length > 2;
  return useQuery({
    queryKey: childApiQueryKey(["searchChildren", institutionId, searchString]),
    queryFn: () => childApi.searchChildren(institutionId, searchString),
    enabled,
    select: (response) =>
      enabled ? response.children.map(mapChildSearchResult) : [],
  });
}

export function getChildrenByPersonQuery(
  childApi: ChildApi,
  personId: string | undefined,
) {
  return queryOptions({
    queryKey: childApiQueryKey(["getChildrenByPerson", personId]),
    queryFn: () =>
      isDefined(personId)
        ? childApi.getChildrenByPersonRaw({ personId }).then(unwrapRawResponse)
        : Promise.reject(new Error("Expected personId to be defined")),
    select: (response) => response.children,
    enabled: isDefined(personId),
  });
}
