/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import {
  ChildApi,
  GetChildrenForSchoolYearTransitionRequest,
  GetDaycaresForSchoolYearTransitionRequest,
  GetSchoolsForSchoolYearTransitionRequest,
} from "@eshg/dental-api";
import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";

import { childApiQueryKey } from "../../../../config/apiQueryKeys";
import { mapChildForTransitionResult } from "../models/SchoolYearTransitionChildResult";
import { mapGroupResult } from "../models/SchoolYearTransitionGroupResult";
import { mapInstitutionResult } from "../models/SchoolYearTransitionResult";

export function getSchoolsForTransitionQuery(
  childApi: ChildApi,
  request: GetSchoolsForSchoolYearTransitionRequest,
) {
  return queryOptions({
    queryKey: childApiQueryKey(["getSchoolsForSchoolYearTransition", request]),
    queryFn: () =>
      childApi
        .getSchoolsForSchoolYearTransitionRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapInstitutionResult),
  });
}

export function getGroupsForTransitionQuery(
  childApi: ChildApi,
  institutionId: string,
) {
  return queryOptions({
    queryKey: childApiQueryKey([
      "getGroupsForSchoolYearTransition",
      institutionId,
    ]),
    queryFn: () => childApi.getGroupsForSchoolYearTransition(institutionId),
    select: (response) => response.elements.map(mapGroupResult),
  });
}

export function getDaycaresForTransitionQuery(
  childApi: ChildApi,
  request: GetDaycaresForSchoolYearTransitionRequest,
) {
  return queryOptions({
    queryKey: childApiQueryKey(["getDaycaresForSchoolYearTransition", request]),
    queryFn: () =>
      childApi
        .getDaycaresForSchoolYearTransitionRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapInstitutionResult),
  });
}

export function getChildrenForTransitionQuery(
  childApi: ChildApi,
  request: GetChildrenForSchoolYearTransitionRequest,
) {
  return queryOptions({
    queryKey: childApiQueryKey(["getChildrenForSchoolYearTransition", request]),
    queryFn: () =>
      childApi
        .getChildrenForSchoolYearTransitionRaw(request)
        .then(unwrapRawResponse),
    select: (response) => response.children.map(mapChildForTransitionResult),
  });
}
