/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetInstitutionGroupsResponse,
  ChildApi,
  GetChildrenRequest,
} from "@eshg/dental-api";
import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { isBlankString } from "@eshg/lib-portal/helpers/guards";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { mapChild } from "@/api/models/Child";
import { mapChildDetails } from "@/api/models/ChildDetails";
import { mapChildSearchResult } from "@/api/models/ChildSearchResult";
import { mapExamination } from "@/api/models/Examination";
import { useDentalApi } from "@/contexts/dental";

import { childApiQueryKey } from "./apiQueryKeys";

export function useGetChildrenQuery(request: GetChildrenRequest) {
  const { childApi } = useDentalApi();

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

export function getExaminationQuery(childApi: ChildApi, examinationId: string) {
  return queryOptions({
    queryKey: childApiQueryKey(["getExamination", examinationId]),
    queryFn: () => childApi.getExamination(examinationId),
    select: mapExamination,
  });
}

export function useSearchInstitutionGroups(institutionId: string) {
  const { childApi } = useDentalApi();

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
