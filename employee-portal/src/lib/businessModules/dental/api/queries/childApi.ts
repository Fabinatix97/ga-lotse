/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetInstitutionGroupsResponse,
  ChildApi,
  GetChildrenRequest,
} from "@eshg/employee-portal-api/dental";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { isBlankString } from "@eshg/lib-portal/helpers/guards";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import { mapChild } from "@/lib/businessModules/dental/api/models/Child";
import { mapChildDetails } from "@/lib/businessModules/dental/api/models/ChildDetails";
import { mapPaginatedList } from "@/lib/shared/api/models/PaginatedList";

import { childApiQueryKey } from "./apiQueryKeys";

export function useGetChildrenQuery(request: GetChildrenRequest) {
  const childApi = useChildApi();

  return queryOptions({
    queryKey: childApiQueryKey(["getChildren", request]),
    queryFn: () => childApi.getChildrenRaw(request).then(unwrapRawResponse),
    select: mapPaginatedList(mapChild),
  });
}

export function getChildDetailsQuery(childApi: ChildApi, childId: string) {
  return queryOptions({
    queryKey: childApiQueryKey(["getChild", childId]),
    queryFn: () => childApi.getChild(childId),
    select: mapChildDetails,
  });
}

export function useSearchInstitutionGroups(institutionId: string) {
  const childApi = useChildApi();

  return useQuery({
    queryKey: childApiQueryKey(["getInstitutionGroups", institutionId]),
    queryFn: () => childApi.getInstitutionGroups(institutionId),
    select: getGroups,
    enabled: !isBlankString(institutionId),
  });

  function getGroups(response: ApiGetInstitutionGroupsResponse) {
    return response.groups;
  }
}
